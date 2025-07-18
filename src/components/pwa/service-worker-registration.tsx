/**
 * Service Worker登録コンポーネント
 *
 * このコンポーネントでは以下の機能を提供します：
 * - Service Workerの自動登録
 * - 更新検知と通知
 * - インストールプロンプトの管理
 * - オフライン状態の検知
 *
 * 主な仕様：
 * - クライアントサイドでのみ実行
 * - プロダクション環境での自動有効化
 * - エラーハンドリングとロギング
 * - 段階的拡張（Progressive Enhancement）
 *
 * 制限事項：
 * - HTTPS環境が必要
 * - モダンブラウザのService Worker対応が必要
 */

'use client'

import { useEffect, useState } from 'react'

/**
 * Service Worker登録状態の型定義
 */
type ServiceWorkerState = {
  /** Service Workerがサポートされているか */
  isSupported: boolean
  /** Service Workerが登録済みか */
  isRegistered: boolean
  /** 更新が利用可能か */
  updateAvailable: boolean
  /** インストールプロンプトが利用可能か */
  installPromptAvailable: boolean
  /** オフライン状態か */
  isOffline: boolean
}

/**
 * BeforeInstallPromptイベントの型定義
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

/**
 * Service Worker登録とPWA機能管理コンポーネント
 *
 * @returns {JSX.Element | null} Service Worker登録コンポーネント（UI無し）
 */
export const ServiceWorkerRegistration: React.FC = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    updateAvailable: false,
    installPromptAvailable: false,
    isOffline: false,
  })

  /**
   * Service Workerの登録処理
   */
  const registerServiceWorker = async (): Promise<void> => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })

      console.log('[PWA] Service Worker登録成功:', registration.scope)

      setState((prev) => ({ ...prev, isRegistered: true }))

      // 更新チェック
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              console.log('[PWA] 新しいコンテンツが利用可能です')
              setState((prev) => ({ ...prev, updateAvailable: true }))

              // カスタムイベントを発行（他のコンポーネントで使用可能）
              window.dispatchEvent(new CustomEvent('sw-update-available'))
            }
          })
        }
      })

      // 即座に更新をチェック
      registration.update()
    } catch (error) {
      console.error('[PWA] Service Worker登録失敗:', error)
    }
  }

  /**
   * インストールプロンプトの処理
   */
  const handleInstallPrompt = (event: BeforeInstallPromptEvent): void => {
    console.log('[PWA] インストールプロンプト利用可能')
    event.preventDefault()

    // グローバルにも保存（PWAUtilsから使用するため）
    ;(
      window as Window & { __pwa_deferred_prompt?: BeforeInstallPromptEvent }
    ).__pwa_deferred_prompt = event

    setState((prev) => ({ ...prev, installPromptAvailable: true }))

    // カスタムイベントを発行
    window.dispatchEvent(new CustomEvent('sw-install-prompt-available'))
  }

  /**
   * オフライン状態の監視
   */
  const handleOnlineStatus = (): void => {
    const isOffline = !navigator.onLine
    setState((prev) => ({ ...prev, isOffline }))

    // カスタムイベントを発行
    window.dispatchEvent(
      new CustomEvent('sw-online-status-change', {
        detail: { isOffline },
      }),
    )
  }

  /**
   * 初期化処理
   */
  useEffect(() => {
    // Service Workerサポートチェック
    if ('serviceWorker' in navigator) {
      setState((prev) => ({ ...prev, isSupported: true }))

      // プロダクション環境でのみ登録
      if (process.env.NODE_ENV === 'production') {
        registerServiceWorker()
      } else {
        console.log('[PWA] 開発環境のためService Workerはスキップされました')
      }
    } else {
      console.warn('[PWA] Service Workerはサポートされていません')
    }

    // インストールプロンプトのリスナー設定
    const installPromptHandler = (event: Event) => {
      handleInstallPrompt(event as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', installPromptHandler)

    // オンライン状態の監視
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    // 初期状態を設定
    handleOnlineStatus()

    // クリーンアップ
    return () => {
      window.removeEventListener('beforeinstallprompt', installPromptHandler)
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  /**
   * Service Worker メッセージの処理
   */
  useEffect(() => {
    if (!state.isSupported) return

    const messageHandler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        console.log('[PWA] Service Workerが更新されました')
        setState((prev) => ({ ...prev, updateAvailable: true }))
      }
    }

    navigator.serviceWorker.addEventListener('message', messageHandler)

    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler)
    }
  }, [state.isSupported])

  // このコンポーネントはUIを描画しません
  return null
}

/**
 * PWA機能を他のコンポーネントで使用するためのユーティリティ関数
 */
export const PWAUtils = {
  /**
   * アプリのインストールを促す
   */
  promptInstall: async (): Promise<boolean> => {
    // グローバルに保存されたdeferredPromptを取得
    const deferredPrompt = (
      window as Window & { __pwa_deferred_prompt?: BeforeInstallPromptEvent }
    ).__pwa_deferred_prompt

    if (!deferredPrompt) {
      console.warn('[PWA] インストールプロンプトが利用できません')
      return false
    }

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice

      console.log('[PWA] インストールプロンプトの結果:', choiceResult.outcome)

      // プロンプトを使用後はクリア
      ;(
        window as Window & { __pwa_deferred_prompt?: BeforeInstallPromptEvent }
      ).__pwa_deferred_prompt = undefined

      return choiceResult.outcome === 'accepted'
    } catch (error) {
      console.error('[PWA] インストールプロンプトエラー:', error)
      return false
    }
  },

  /**
   * Service Workerの更新を適用
   */
  applyUpdate: (): void => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  },

  /**
   * 特定のURLのキャッシュを更新
   */
  updateCache: (url: string): void => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_UPDATE',
        url,
      })
    }
  },

  /**
   * PWAの状態を取得（カスタムイベントリスナーで監視）
   */
  onStatusChange: (callback: (event: CustomEvent) => void): (() => void) => {
    const events = [
      'sw-update-available',
      'sw-install-prompt-available',
      'sw-online-status-change',
    ]

    events.forEach((eventName) => {
      window.addEventListener(eventName, callback as EventListener)
    })

    // クリーンアップ関数を返す
    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, callback as EventListener)
      })
    }
  },
}
