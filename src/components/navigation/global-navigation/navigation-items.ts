/**
 * ナビゲーション項目の型定義
 */
export type NavigationItem = {
  /** 表示名 */
  label: string
  /** リンク先パス */
  href: string
  /** アクセシビリティ用のaria-label */
  ariaLabel: string
}

/**
 * ナビゲーション項目の設定
 */
export const navigationItems: NavigationItem[] = [
  {
    label: 'work',
    href: '/',
    ariaLabel: 'ポートフォリオ作品一覧へ移動',
  },
  {
    label: 'blog',
    href: '/blogs',
    ariaLabel: 'ブログ記事一覧へ移動',
  },
  {
    label: 'profile',
    href: '/profile',
    ariaLabel: 'プロフィールページへ移動',
  },
]
