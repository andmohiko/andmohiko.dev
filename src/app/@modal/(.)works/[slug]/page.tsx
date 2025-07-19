/**
 * ポートフォリオ詳細モーダルページコンポーネント
 *
 * 制限事項：
 * - Next.js App RouterのIntercepting Routesが必要
 * - ビルド時にmicroCMSからデータを取得してSSG生成
 */

/* 例：ポートフォリオ詳細へのリンクをクリック
// URLをクリック
// ↓ URLが /works/my-first-work に変更される

// ↓ Next.jsのルーティングシステムが以下を実行：
// - @main スロット: works/[slug]/page.tsx（通常ページ）
// - @modal スロット: (.)works/[slug]/page.tsx（Intercepting Routes）

// ↓ layout.tsxに以下が渡される：
// - main: WorkDetailPage コンポーネント  
// - modal: WorkModalPage コンポーネント ← これがtruthyになる

// ↓ modal && が true となり、ModalWrapperが表示される */

import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { WorkContent } from './components/work-content'
import { getAllWorks } from '@/lib/microcms'

/**
 * 静的生成の設定
 * ビルド時にmicroCMSからデータを取得して静的ページを生成
 */
export const dynamic = 'force-static'
export const revalidate = false

/**
 * 静的生成用のパラメータ生成
 * ビルド時に全ポートフォリオのslugを取得してSSG対象を決定
 *
 * @returns {Promise<Array<{slug: string}>>} 静的生成対象のパラメータ配列
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const works = await getAllWorks()

    if (!works || works.length === 0) {
      console.warn('generateStaticParams: ポートフォリオが取得できませんでした')
      return []
    }

    const params = works.map((work) => ({
      slug: work.id,
    }))

    console.log(
      `generateStaticParams: ${params.length}件のポートフォリオページを静的生成します`,
    )

    return params
  } catch (error) {
    console.error('generateStaticParams: ポートフォリオの取得に失敗しました', {
      error: error instanceof Error ? error.message : error,
      function: 'generateStaticParams',
      source: 'WorkModalPage',
    })
    return []
  }
}

/**
 * ページパラメータの型定義
 */
type WorkModalPageProps = {
  /** ルートパラメータ */
  params: Promise<{
    /** ポートフォリオのスラッグ */
    slug: string
  }>
}

/**
 * メタデータ生成関数
 * 各ポートフォリオのタイトルと説明をメタデータに設定
 *
 * @param {WorkModalPageProps} props - ページのプロパティ
 * @returns {Promise<Metadata>} 生成されたメタデータ
 */
export async function generateMetadata({
  params,
}: WorkModalPageProps): Promise<Metadata> {
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
        title: 'ポートフォリオが見つかりません',
        description: '指定されたポートフォリオが見つかりませんでした。',
      }
    }

    const works = await getAllWorks()
    const work = works.find((work) => work.id === slug)

    if (!work) {
      console.error(
        'generateMetadata: 指定されたslugのポートフォリオが見つかりません',
        {
          slug,
          function: 'generateMetadata',
          source: 'getAllWorks',
        },
      )
      return {
        title: 'ポートフォリオが見つかりません',
        description: '指定されたポートフォリオが見つかりませんでした。',
      }
    }

    const workTitle = work.title
    const workDescription = work.description
    const workHeaderImageUrl = work.thumbnail.url

    return {
      title: workTitle,
      description: workDescription,
      openGraph: {
        title: `${workTitle} | andmohiko.dev`,
        description: workDescription,
        type: 'article',
        authors: ['andmohiko'],
        images: workHeaderImageUrl
          ? [
              {
                url: workHeaderImageUrl.startsWith('//')
                  ? `https:${workHeaderImageUrl}`
                  : workHeaderImageUrl,
                width: 1200,
                height: 630,
                alt: workTitle,
              },
            ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${workTitle} | andmohiko.dev`,
        description: workDescription,
        creator: '@andmohiko',
        images: workHeaderImageUrl
          ? [
              workHeaderImageUrl.startsWith('//')
                ? `https:${workHeaderImageUrl}`
                : workHeaderImageUrl,
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
      title: 'ポートフォリオの読み込みエラー',
      description: 'ポートフォリオの読み込み中にエラーが発生しました。',
    }
  }
}

/**
 * ポートフォリオ詳細モーダルページコンポーネント
 *
 * @param {WorkModalPageProps} props - ページのプロパティ
 * @returns {Promise<JSX.Element>} ポートフォリオ詳細モーダル
 */
export default async function WorkModalPage({
  params,
}: WorkModalPageProps): Promise<React.ReactElement> {
  try {
    const resolvedParams = await params
    const slug = (resolvedParams.slug as string) || ''

    if (!slug) {
      console.error('WorkModalPage: slugパラメータが無効です', {
        slug,
        function: 'WorkModalPage',
        params: resolvedParams,
      })
      notFound()
    }

    const works = await getAllWorks()
    const work = works.find((work) => work.id === slug)
    const workIndex = works.findIndex((work) => work.id === slug)
    const nextWork = workIndex > 0 ? works[workIndex - 1] : null
    const previousWork =
      workIndex < works.length - 1 ? works[workIndex + 1] : null
    const previousSlug = previousWork?.id
    const nextSlug = nextWork?.id

    if (!work) {
      console.error(
        'WorkModalPage: 指定されたslugのポートフォリオが見つかりません',
        {
          slug,
          function: 'WorkModalPage',
          source: 'getAllWorks',
        },
      )
      notFound()
    }

    return (
      <WorkContent
        work={work}
        previousSlug={previousSlug}
        nextSlug={nextSlug}
      />
    )
  } catch (error) {
    console.error('WorkModalPage: ポートフォリオデータの取得に失敗しました', {
      error: error instanceof Error ? error.message : error,
      function: 'WorkModalPage',
      params: await params,
    })
    notFound()
  }
}
