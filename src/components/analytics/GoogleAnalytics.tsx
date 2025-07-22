/**
 * Google Analytics コンポーネント
 *
 * このコンポーネントでは以下の機能を提供します：
 * - Google Analytics 4 (GA4) の初期化
 * - Next.js Script コンポーネントによる最適化された読み込み
 * - 環境変数による設定管理
 * - プライバシー配慮した実装
 *
 * 主な仕様：
 * - 本番環境でのみ動作
 * - 非同期読み込みによるパフォーマンス最適化
 * - TypeScript対応
 *
 * 制限事項：
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID環境変数が必要
 * - 本番環境（NODE_ENV=production）でのみ有効
 */

'use client'

import Script from 'next/script'

/**
 * Google Analytics gtag 関数の型定義
 */
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'consent',
      targetIdOrAction: string | Date | 'update' | 'default',
      parameters?: {
        page_path?: string
        anonymize_ip?: boolean
        event_category?: string
        event_label?: string
        value?: number
        analytics_storage?: 'granted' | 'denied'
        ad_storage?: 'granted' | 'denied'
        wait_for_update?: number
      },
    ) => void
    dataLayer: unknown[]
  }
}

/**
 * Google Analytics プロパティ型
 */
type GoogleAnalyticsProps = {
  /** Google Analytics Measurement ID */
  measurementId: string
}

/**
 * Google Analytics コンポーネント
 *
 * @param {GoogleAnalyticsProps} props - Google Analyticsのプロパティ
 * @returns {JSX.Element | null} Google Analyticsスクリプト または null
 */
export const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({
  measurementId,
}) => {
  // 開発環境では何も表示しない
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  // Measurement IDが設定されていない場合は何も表示しない
  if (!measurementId || measurementId.trim() === '') {
    console.warn('Google Analytics: Measurement ID is not provided')
    return null
  }

  return (
    <>
      {/* Google Analytics gtag.js スクリプト */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        async
      />

      {/* Google Analytics 初期化スクリプト */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // コンセント管理の初期設定
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              wait_for_update: 500
            });
            
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_expires: 63072000,
              cookie_update: true,
              cookie_flags: 'SameSite=None;Secure',
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              storage: 'none'
            });
          `,
        }}
      />
    </>
  )
}

/**
 * Google Analytics ページビュー追跡関数
 *
 * @param {string} url - 追跡するページURL
 */
export const trackPageView = (url: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
    })
  }
}

/**
 * Google Analytics イベント追跡関数
 *
 * @param {string} action - イベントアクション
 * @param {string} category - イベントカテゴリ
 * @param {string} label - イベントラベル（オプション）
 * @param {number} value - イベント値（オプション）
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
