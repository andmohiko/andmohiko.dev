/**
 * ブログ詳細モーダルページコンポーネント
 *
 * 制限事項：
 * - Next.js App RouterのIntercepting Routesが必要
 * - ビルド時にContentfulからデータを取得してSSG生成
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
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dayjs from 'dayjs'
import { BlogContent } from './components/blog-content'
import {
  getAggregatedBlogBySlug,
  getAllAggregatedBlogs,
  convertToBlogArray,
} from '@/lib/blog-aggregator'

/**
 * 静的生成の設定
 * ビルド時にContentfulからデータを取得して静的ページを生成
 */
export const dynamic = 'force-static'
export const revalidate = false

/**
 * 静的生成用のパラメータ生成
 * ビルド時に全ブログのslugを取得してSSG対象を決定
 *
 * @returns {Promise<Array<{slug: string}>>} 静的生成対象のパラメータ配列
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    // 統合ブログ（Contentful + サブモジュール）からパラメータを生成
    const aggregatedBlogs = await getAllAggregatedBlogs()
    const blogs = convertToBlogArray(aggregatedBlogs)

    if (!blogs || blogs.length === 0) {
      console.warn('generateStaticParams: ブログ記事が取得できませんでした')
      return []
    }

    // slugが存在する記事のみを対象とする
    const params = blogs
      .filter((blog) => blog.slug)
      .map((blog) => ({
        slug: blog.slug!,
      }))

    console.log(
      `generateStaticParams: ${params.length}件のブログページを静的生成します`,
    )

    return params
  } catch (error) {
    console.error('generateStaticParams: ブログ記事の取得に失敗しました', {
      error: error instanceof Error ? error.message : error,
      function: 'generateStaticParams',
      source: 'BlogModalPage',
    })
    return []
  }
}

/**
 * ページパラメータの型定義
 */
type BlogModalPageProps = {
  /** ルートパラメータ */
  params: Promise<{
    /** ブログ記事のスラッグ */
    slug: string
  }>
}

/**
 * メタデータ生成関数
 * 各ブログ記事のタイトルと説明をメタデータに設定
 *
 * @param {BlogModalPageProps} props - ページのプロパティ
 * @returns {Promise<Metadata>} 生成されたメタデータ
 */
export async function generateMetadata({
  params,
}: BlogModalPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const slug = (resolvedParams.slug as string) || ''

    if (!slug) {
      console.error('generateMetadata: slugパラメータが無効です', {
        slug,
        function: 'generateMetadata',
        params: resolvedParams,
      })
      return {
        title: 'ブログ記事が見つかりません',
        description: '指定されたブログ記事が見つかりませんでした。',
      }
    }

    const { blog } = await getAggregatedBlogBySlug(slug)

    if (!blog) {
      console.error(
        'generateMetadata: 指定されたslugのブログが見つかりません',
        {
          slug,
          function: 'generateMetadata',
          source: 'getBlogById',
        },
      )
      return {
        title: 'ブログ記事が見つかりません',
        description: '指定されたブログ記事が見つかりませんでした。',
      }
    }

    const blogTitle = blog.title
    const blogDescription = blog.description
    const blogHeaderImageUrl = blog.headerImageUrl
    const blogPublishedAt = blog.publishedAt

    return {
      title: blogTitle,
      description: blogDescription,
      openGraph: {
        title: `${blogTitle} | andmohiko.dev`,
        description: blogDescription,
        type: 'article',
        publishedTime: blogPublishedAt,
        authors: ['andmohiko'],
        images: blogHeaderImageUrl
          ? [
              {
                url: blogHeaderImageUrl.startsWith('//')
                  ? `https:${blogHeaderImageUrl}`
                  : blogHeaderImageUrl,
                width: 1200,
                height: 630,
                alt: blogTitle,
              },
            ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${blogTitle} | andmohiko.dev`,
        description: blogDescription,
        creator: '@andmohiko',
        images: blogHeaderImageUrl
          ? [
              blogHeaderImageUrl.startsWith('//')
                ? `https:${blogHeaderImageUrl}`
                : blogHeaderImageUrl,
            ]
          : undefined,
      },
      authors: [{ name: 'andmohiko' }],
      creator: 'andmohiko',
      publisher: 'andmohiko',
    }
  } catch (error) {
    console.error('generateMetadata: メタデータの生成に失敗しました', {
      error: error instanceof Error ? error.message : error,
      function: 'generateMetadata',
      params: await params,
    })
    return {
      title: 'ブログ記事の読み込みエラー',
      description: 'ブログ記事の読み込み中にエラーが発生しました。',
    }
  }
}

/**
 * ブログ詳細モーダルページコンポーネント
 *
 * @param {BlogModalPageProps} props - ページのプロパティ
 * @returns {Promise<JSX.Element>} ブログ詳細モーダル
 */
export default async function BlogModalPage({
  params,
}: BlogModalPageProps): Promise<React.ReactElement> {
  try {
    const resolvedParams = await params
    const slug = (resolvedParams.slug as string) || ''

    if (!slug) {
      console.error('BlogModalPage: slugパラメータが無効です', {
        slug,
        function: 'BlogModalPage',
        params: resolvedParams,
      })
      notFound()
    }

    const { blog, previousSlug, nextSlug } = await getAggregatedBlogBySlug(slug)

    if (!blog) {
      console.error('BlogModalPage: 指定されたslugのブログが見つかりません', {
        slug,
        function: 'BlogModalPage',
        source: 'getBlogById',
      })
      notFound()
    }

    // サーバーサイドで日付をフォーマットしてHydrationエラーを防ぐ
    const formattedDate = dayjs(blog.publishedAt).format('YYYY.MM.DD')

    return (
      <BlogContent
        blog={blog}
        formattedDate={formattedDate}
        previousSlug={previousSlug}
        nextSlug={nextSlug}
      />
    )
  } catch (error) {
    console.error('BlogModalPage: ブログデータの取得に失敗しました', {
      error: error instanceof Error ? error.message : error,
      function: 'BlogModalPage',
      params: await params,
    })
    notFound()
  }
}
