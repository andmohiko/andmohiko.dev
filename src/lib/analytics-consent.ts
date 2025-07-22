/**
 * Google Analytics コンセント管理ユーティリティ
 *
 * このファイルでは以下の機能を提供します：
 * - ユーザーの分析同意状態の管理
 * - localStorage を使用した同意状態の永続化
 * - サードパーティークッキー問題への対応
 * - プライバシー配慮した実装
 *
 * 主な仕様：
 * - 同意状態のlocalStorage管理
 * - デフォルトで分析無効
 * - TypeScript対応
 *
 * 制限事項：
 * - localStorage対応ブラウザが必要
 * - クライアントサイドでのみ動作
 */

/**
 * 分析同意状態の型定義
 */
export type AnalyticsConsent = {
  /** 分析機能への同意 */
  analytics: boolean
  /** 同意取得日時 */
  timestamp: number
}

/**
 * LocalStorageキー
 */
const CONSENT_STORAGE_KEY = 'analytics-consent'

/**
 * デフォルトの同意設定
 */
const DEFAULT_CONSENT: AnalyticsConsent = {
  analytics: false,
  timestamp: 0,
}

/**
 * 分析同意状態を取得
 *
 * @returns {AnalyticsConsent} 現在の同意状態
 */
export const getAnalyticsConsent = (): AnalyticsConsent => {
  if (typeof window === 'undefined') {
    return DEFAULT_CONSENT
  }

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as AnalyticsConsent
    }
  } catch (error) {
    console.warn('Failed to get analytics consent:', error)
  }

  return DEFAULT_CONSENT
}

/**
 * 分析同意状態を設定
 *
 * @param {boolean} analytics - 分析機能への同意
 */
export const setAnalyticsConsent = (analytics: boolean): void => {
  if (typeof window === 'undefined') {
    return
  }

  const consent: AnalyticsConsent = {
    analytics,
    timestamp: Date.now(),
  }

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent))

    // Google Analytics に同意状態を送信
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: 'denied', // 広告は常に無効
      })
    }
  } catch (error) {
    console.warn('Failed to set analytics consent:', error)
  }
}

/**
 * 分析が有効かどうかを確認
 *
 * @returns {boolean} 分析が有効な場合はtrue
 */
export const isAnalyticsEnabled = (): boolean => {
  const consent = getAnalyticsConsent()
  return consent.analytics
}

/**
 * 同意状態をリセット
 */
export const resetAnalyticsConsent = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to reset analytics consent:', error)
  }
}
