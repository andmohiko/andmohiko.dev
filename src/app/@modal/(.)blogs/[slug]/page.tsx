/**
 * ブログ詳細モーダルページコンポーネント
 *
 * 制限事項：
 * - Next.js App RouterのIntercepting Routesが必要
 */

/* 例：ブログ詳細へのリンクをクリック
// URLをクリック
// ↓ URLが /blogs/my-first-post に変更される

// ↓ Next.jsのルーティングシステムが以下を実行：
// - @main スロット: blogs/[slug]/page.tsx（通常ページ）
// - @modal スロット: (.)blogs/[slug]/page.tsx（Intercepting Routes）

// ↓ layout.tsxに以下が渡される：
// - main: BlogDetailPage コンポーネント  
// - modal: BlogModalPage コンポーネント ← これがtruthyになる

// ↓ modal && が true となり、ModalWrapperが表示される */

import React from 'react'
import { BlogContent } from './components/blog-content'
import { getBlogById } from '@/lib/contentful'

/**
 * ページパラメータの型定義
 */
type BlogModalPageProps = {
  /** ルートパラメータ */
  params: {
    /** ブログ記事のスラッグ */
    slug: string
  }
}

/**
 * ブログ詳細モーダルページコンポーネント
 *
 * @param {BlogModalPageProps} props - ページのプロパティ
 * @returns {Promise<JSX.Element>} ブログ詳細モーダル
 */
const BlogModalPage: React.FC<BlogModalPageProps> = async ({ params }) => {
  const { slug } = params
  const blog = await getBlogById(slug)

  return <BlogContent blog={blog} />
}

export default BlogModalPage
