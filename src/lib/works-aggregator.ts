/**
 * Works統合取得ライブラリ
 *
 * 概要：
 * - microCMS、Markdownからworksデータを統合取得
 * - 統一されたAggregatedWork型でデータを返す
 * - 個別workの取得とナビゲーション情報の提供
 *
 * 制限事項：
 * - ビルド時のみ実行可能
 * - エラー処理はソース別に実装
 */
import { getAllWorks } from '@/lib/microcms'
import {
  getAllMarkdownWorks,
  getMarkdownWorkBySlug,
} from '@/lib/works-markdown'
import type { AggregatedWork, Work, WorkWithSource } from '@/types/work'

/**
 * すべてのソースからworks を取得し統合
 *
 * @returns 統合されたworksの配列
 */
export const getAllAggregatedWorks = async (): Promise<AggregatedWork[]> => {
  try {
    // 並行処理ですべてのソースからデータを取得
    const [microCmsWorks, markdownWorks] = await Promise.all([
      getAllWorks().catch((error) => {
        console.error('microCMSからのworks取得でエラーが発生しました:', error)
        return []
      }),
      getAllMarkdownWorks().catch((error) => {
        console.error('Markdownからのworks取得でエラーが発生しました:', error)
        return []
      }),
    ])

    // microCMS worksにsourceフィールドを追加
    const microCmsWorksWithSource: WorkWithSource[] = microCmsWorks.map(
      (work) => ({
        ...work,
        source: 'microcms' as const,
      }),
    )

    // すべてのworksを統合してソート
    const allWorks: AggregatedWork[] = [
      ...microCmsWorksWithSource,
      ...markdownWorks,
    ]

    // publishAt（降順）でソート
    const sorted = allWorks.sort(
      (a, b) =>
        new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime(),
    )

    // デバッグ: ソート結果を確認
    console.log(
      '📊 Works ソート結果:',
      sorted.map((w) => ({
        id: w.id,
        publishAt: w.publishAt,
        source: w.source,
      })),
    )

    return sorted
  } catch (error) {
    console.error('works統合取得でエラーが発生しました:', error)
    return []
  }
}

/**
 * スラッグによる特定のwork取得（全ソース対応）
 *
 * @param slug - workのスラッグ（idまたはslugフィールド）
 * @returns workデータとナビゲーション情報
 */
export const getAggregatedWorkBySlug = async (
  slug: string,
): Promise<{
  work: AggregatedWork
  previousSlug: string | undefined
  nextSlug: string | undefined
}> => {
  try {
    const allWorks = await getAllAggregatedWorks()
    const currentIndex = allWorks.findIndex((work) => work.id === slug)

    if (currentIndex === -1) {
      throw new Error(`Work not found: ${slug}`)
    }

    return {
      work: allWorks[currentIndex],
      previousSlug: allWorks[currentIndex + 1]?.id,
      nextSlug: allWorks[currentIndex - 1]?.id,
    }
  } catch (error) {
    console.error(
      `統合work個別取得でエラーが発生しました (slug: ${slug}):`,
      error,
    )
    throw error
  }
}

/**
 * 統合worksから通常のWork型配列に変換
 *
 * @param aggregatedWorks - 統合worksの配列
 * @returns Work型の配列（sourceフィールドを除外）
 */
export const convertToWorkArray = (aggregatedWorks: AggregatedWork[]): Work[] => {
  return aggregatedWorks.map((work) => {
    if (work.source === 'markdown') {
      // Markdown版の場合、slug フィールドを除外
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { slug: _slug, source: _source, ...workWithoutSlug } = work
      return workWithoutSlug as Work
    } else {
      // microCMS版の場合、source フィールドを除外
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { source: _source, ...workWithoutSource } = work
      return workWithoutSource
    }
  })
}
