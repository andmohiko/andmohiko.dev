/**
 * Markdownベースのworks取得ライブラリ
 *
 * 概要：
 * - src/content/works/ 内のMarkdownファイルを読み込み、パースする
 * - front-matterを解析してメタデータを取得
 * - 画像パスを相対パスから絶対パスに変換
 *
 * 制限事項：
 * - ビルド時のみ実行可能（fs.readFileSync使用）
 * - 開発環境では動的読み込み、本番環境では静的生成
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import sizeOf from 'image-size'

import type { MarkdownWork, MarkdownWorkFrontMatter } from '@/types/work'

/**
 * Markdownファイルの完全データ型定義
 */
type MarkdownWorkPost = {
  metadata: MarkdownWorkFrontMatter
  content: string
  slug: string
  dirPath: string
}

/**
 * worksコンテンツディレクトリパス
 */
const WORKS_DIRECTORY = path.join(process.cwd(), 'src/contents/works')

/**
 * 指定されたディレクトリから index.md ファイルを検索
 *
 * @param dirPath - 検索対象のディレクトリパス
 * @returns { slug, filePath } の配列
 */
const findWorkDirectories = (
  dirPath: string,
): Array<{ slug: string; filePath: string }> => {
  try {
    const workDirectories: Array<{ slug: string; filePath: string }> = []

    if (!fs.existsSync(dirPath)) {
      console.warn(`worksディレクトリが見つかりません: ${dirPath}`)
      return workDirectories
    }

    const items = fs.readdirSync(dirPath)

    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        // 各ディレクトリ内の index.md を探す
        const indexMdPath = path.join(fullPath, 'index.md')
        if (fs.existsSync(indexMdPath)) {
          workDirectories.push({
            slug: item,
            filePath: indexMdPath,
          })
        }
      }
    }

    return workDirectories
  } catch (error) {
    console.error(`workディレクトリ検索でエラーが発生しました: ${error}`)
    return []
  }
}

/**
 * Markdownファイルを読み込み、front-matterとコンテンツを解析
 *
 * @param filePath - Markdownファイルのパス
 * @param slug - workのスラッグ（ディレクトリ名）
 * @returns 解析されたMarkdownポストデータ
 */
const parseMarkdownFile = async (
  filePath: string,
  slug: string,
): Promise<MarkdownWorkPost | null> => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    // front-matterの必須フィールドをチェック
    if (!data.id || !data.title || !data.description || !data.publishAt) {
      console.warn(`必須のfront-matterフィールドが不足しています: ${filePath}`)
      return null
    }

    return {
      metadata: data as MarkdownWorkFrontMatter,
      content,
      slug,
      dirPath: path.dirname(filePath),
    }
  } catch (error) {
    console.error(
      `Markdownファイルの解析でエラーが発生しました (${filePath}): ${error}`,
    )
    return null
  }
}

/**
 * 相対画像パスをpublicディレクトリの画像パスに変換
 *
 * @param relativePath - front-matterで指定された画像パス (例: "./images/thumbnail.png")
 * @param slug - workのスラッグ
 * @returns 解決された画像パス (例: "/images/works/my-work/thumbnail.png")
 */
const resolveImagePath = (relativePath: string, slug: string): string => {
  try {
    if (relativePath.startsWith('http')) {
      // 絶対URLの場合はそのまま返す
      return relativePath
    }

    if (relativePath.startsWith('./')) {
      // 相対パスの場合は、publicディレクトリの対応するパスに変換
      // "./images/thumbnail.png" -> "/images/works/{slug}/thumbnail.png"
      const imagePathWithoutDot = relativePath.replace('./', '')
      // "images/" プレフィックスを除去
      const imageName = imagePathWithoutDot.replace(/^images\//, '')
      return `/images/works/${slug}/${imageName}`
    }

    // その他の場合はそのまま返す
    return relativePath
  } catch (error) {
    console.error(
      `画像パス解決でエラーが発生しました (relativePath: ${relativePath}, slug: ${slug}): ${error}`,
    )
    return relativePath
  }
}

/**
 * 画像ファイルのサイズを取得
 *
 * @param imagePath - 画像ファイルのパス
 * @returns { width, height }
 */
const getImageDimensions = (
  imagePath: string,
): { width: number; height: number } => {
  try {
    const imageBuffer = fs.readFileSync(imagePath)
    const dimensions = sizeOf(imageBuffer)
    return {
      width: dimensions.width || 1200,
      height: dimensions.height || 630,
    }
  } catch (error) {
    console.warn(`画像サイズ取得に失敗しました (${imagePath}): ${error}`)
    return { width: 1200, height: 630 }
  }
}

/**
 * Markdownコンテンツ内の画像パスを変換
 *
 * @param markdownContent - Markdownコンテンツ
 * @param slug - workのスラッグ
 * @returns 画像パスが変換されたMarkdownコンテンツ
 */
const transformImagePaths = (
  markdownContent: string,
  slug: string,
): string => {
  try {
    // 画像の正規表現パターン: ![alt](./images/example.png) または ![alt](./path/to/image.jpg)
    const imageRegex = /!\[([^\]]*)\]\(\.\/([^)]+)\)/g

    return markdownContent.replace(imageRegex, (match, alt, imagePath) => {
      // 相対パスを絶対パスに変換
      const resolvedImagePath = resolveImagePath(`./${imagePath}`, slug)
      return `![${alt}](${resolvedImagePath})`
    })
  } catch (error) {
    console.error(`画像パス変換でエラーが発生しました: ${error}`)
    return markdownContent
  }
}

/**
 * Markdown版の全works取得
 *
 * @returns MarkdownWork型の配列
 */
export const getAllMarkdownWorks = async (): Promise<MarkdownWork[]> => {
  try {
    const workDirectories = findWorkDirectories(WORKS_DIRECTORY)
    const posts: MarkdownWorkPost[] = []

    // 各Markdownファイルを並行処理で解析
    const parsePromises = workDirectories.map(({ slug, filePath }) =>
      parseMarkdownFile(filePath, slug),
    )
    const parsedResults = await Promise.all(parsePromises)

    // 有効な結果のみをフィルタリング
    for (const result of parsedResults) {
      if (result !== null) {
        posts.push(result)
      }
    }

    // MarkdownWork型に変換
    const works: MarkdownWork[] = posts.map((post) => {
      // サムネイル画像のパスを解決
      const thumbnailPath = resolveImagePath(
        post.metadata.thumbnail,
        post.slug,
      )

      // サムネイル画像のサイズを取得
      let thumbnailDimensions = { width: 1200, height: 630 }
      if (post.metadata.thumbnail.startsWith('./')) {
        const actualImagePath = path.join(
          post.dirPath,
          post.metadata.thumbnail,
        )
        if (fs.existsSync(actualImagePath)) {
          thumbnailDimensions = getImageDimensions(actualImagePath)
        }
      }

      return {
        id: post.metadata.id,
        slug: post.slug,
        title: post.metadata.title,
        description: post.metadata.description,
        publishAt: post.metadata.publishAt,
        tags: post.metadata.tags,
        link: post.metadata.link,
        thumbnail: {
          url: thumbnailPath,
          width: thumbnailDimensions.width,
          height: thumbnailDimensions.height,
        },
        body: transformImagePaths(post.content, post.slug),
        source: 'markdown' as const,
      }
    })

    // publishAt（降順）でソート
    return works.sort(
      (a, b) =>
        new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime(),
    )
  } catch (error) {
    console.error(`Markdown works取得でエラーが発生しました: ${error}`)
    return []
  }
}

/**
 * スラッグによる特定のwork取得
 *
 * @param slug - workのスラッグ
 * @returns work データとナビゲーション情報
 */
export const getMarkdownWorkBySlug = async (
  slug: string,
): Promise<{
  work: MarkdownWork | null
  previousSlug: string | undefined
  nextSlug: string | undefined
}> => {
  try {
    const allWorks = await getAllMarkdownWorks()
    const work = allWorks.find((w) => w.id === slug || w.slug === slug) || null

    if (!work) {
      return { work: null, previousSlug: undefined, nextSlug: undefined }
    }

    const currentIndex = allWorks.findIndex(
      (w) => w.id === slug || w.slug === slug,
    )
    const nextSlug =
      currentIndex > 0 ? allWorks[currentIndex - 1].id : undefined
    const previousSlug =
      currentIndex < allWorks.length - 1
        ? allWorks[currentIndex + 1].id
        : undefined

    return { work, previousSlug, nextSlug }
  } catch (error) {
    console.error(
      `Markdown work個別取得でエラーが発生しました (slug: ${slug}): ${error}`,
    )
    return { work: null, previousSlug: undefined, nextSlug: undefined }
  }
}
