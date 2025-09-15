/**
 * サブモジュールコンテンツ取得ライブラリ
 *
 * 概要：
 * - サブモジュール内のMarkdownファイルを読み込み、パースする
 * - front-matterを解析してメタデータを取得
 * - MarkdownをHTMLに変換
 *
 * 制限事項：
 * - ビルド時のみ実行可能（fs.readFileSync使用）
 * - 開発環境では動的読み込み、本番環境では静的生成
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import type { Blog } from '@/types/blog'

/**
 * サブモジュール内のMarkdownファイルのメタデータ型定義
 */
type MarkdownFrontMatter = {
  title: string
  slug: string
  description: string
  date: string
  headerImage?: string
}

/**
 * Markdownファイルの完全データ型定義
 */
type MarkdownPost = {
  metadata: MarkdownFrontMatter
  content: string
  filePath: string
}

/**
 * サブモジュールのコンテンツディレクトリパス
 */
const CONTENT_DIRECTORY = path.join(
  process.cwd(),
  'src/contents/blogs/articles',
)

/**
 * 指定されたディレクトリから再帰的にMarkdownファイルを検索
 *
 * @param dirPath - 検索対象のディレクトリパス
 * @returns Markdownファイルパスの配列
 */
const findMarkdownFiles = (dirPath: string): string[] => {
  try {
    const markdownFiles: string[] = []

    if (!fs.existsSync(dirPath)) {
      console.warn(`サブモジュールディレクトリが見つかりません: ${dirPath}`)
      return markdownFiles
    }

    const items = fs.readdirSync(dirPath)

    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        // ディレクトリの場合は再帰的に検索
        markdownFiles.push(...findMarkdownFiles(fullPath))
      } else if (stat.isFile() && item.endsWith('.md')) {
        // Markdownファイルの場合は配列に追加
        markdownFiles.push(fullPath)
      }
    }

    return markdownFiles
  } catch (error) {
    console.error(`Markdownファイル検索でエラーが発生しました: ${error}`)
    return []
  }
}

/**
 * Markdownファイルを読み込み、front-matterとコンテンツを解析
 *
 * @param filePath - Markdownファイルのパス
 * @returns 解析されたMarkdownポストデータ
 */
const parseMarkdownFile = async (
  filePath: string,
): Promise<MarkdownPost | null> => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    // front-matterの必須フィールドをチェック
    if (!data.title || !data.slug || !data.description || !data.date) {
      console.warn(`必須のfront-matterフィールドが不足しています: ${filePath}`)
      return null
    }

    return {
      metadata: data as MarkdownFrontMatter,
      content,
      filePath,
    }
  } catch (error) {
    console.error(
      `Markdownファイルの解析でエラーが発生しました (${filePath}): ${error}`,
    )
    return null
  }
}

/**
 * サブモジュール内のすべてのブログ記事を取得
 *
 * @returns Blog型の配列
 */
export const getSubmoduleBlogPosts = async (): Promise<Blog[]> => {
  try {
    const markdownFiles = findMarkdownFiles(CONTENT_DIRECTORY)
    const posts: MarkdownPost[] = []

    // 各Markdownファイルを並行処理で解析
    const parsePromises = markdownFiles.map(parseMarkdownFile)
    const parsedResults = await Promise.all(parsePromises)

    // 有効な結果のみをフィルタリング
    for (const result of parsedResults) {
      if (result !== null) {
        posts.push(result)
      }
    }

    // Blog型に変換（Markdownの画像パスを変換）
    const blogs: Blog[] = posts.map((post) => ({
      id: post.metadata.slug,
      title: post.metadata.title,
      description: post.metadata.description,
      body: transformImagePaths(post.content, post.filePath),
      slug: post.metadata.slug,
      publishedAt: post.metadata.date,
      headerImageUrl: post.metadata.headerImage
        ? resolveImagePath(post.metadata.headerImage, post.filePath)
        : undefined,
      url: undefined,
      // 記事のディレクトリパスを追加（画像パス解決用）
      articlePath: getArticlePath(post.filePath),
    }))

    // 公開日時でソート（新しい順）
    return blogs.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
  } catch (error) {
    console.error(`サブモジュールブログ取得でエラーが発生しました: ${error}`)
    return []
  }
}

/**
 * スラッグによる特定のブログ記事取得
 *
 * @param slug - 記事のスラッグ
 * @returns 記事データとナビゲーション情報
 */
export const getSubmoduleBlogBySlug = async (
  slug: string,
): Promise<{
  blog: Blog | null
  previousSlug: string | undefined
  nextSlug: string | undefined
}> => {
  try {
    const allBlogs = await getSubmoduleBlogPosts()
    const blog = allBlogs.find((b) => b.slug === slug) || null

    if (!blog) {
      return { blog: null, previousSlug: undefined, nextSlug: undefined }
    }

    const currentIndex = allBlogs.findIndex((b) => b.slug === slug)
    const previousSlug =
      currentIndex > 0 ? allBlogs[currentIndex - 1].slug : undefined
    const nextSlug =
      currentIndex < allBlogs.length - 1
        ? allBlogs[currentIndex + 1].slug
        : undefined

    return { blog, previousSlug, nextSlug }
  } catch (error) {
    console.error(
      `サブモジュールブログ個別取得でエラーが発生しました (slug: ${slug}): ${error}`,
    )
    return { blog: null, previousSlug: undefined, nextSlug: undefined }
  }
}

/**
 * Markdownコンテンツ内の画像パスを変換
 *
 * @param markdownContent - Markdownコンテンツ
 * @param markdownFilePath - Markdownファイルのパス
 * @returns 画像パスが変換されたMarkdownコンテンツ
 */
const transformImagePaths = (
  markdownContent: string,
  markdownFilePath: string,
): string => {
  try {
    // 画像の正規表現パターン: ![alt](./images/example.png) または ![alt](./path/to/image.jpg)
    const imageRegex = /!\[([^\]]*)\]\(\.\/([^)]+)\)/g

    return markdownContent.replace(imageRegex, (match, alt, imagePath) => {
      // 相対パスを絶対パスに変換
      const resolvedImagePath = resolveImagePath(
        `./${imagePath}`,
        markdownFilePath,
      )
      return `![${alt}](${resolvedImagePath})`
    })
  } catch (error) {
    console.error(`画像パス変換でエラーが発生しました: ${error}`)
    return markdownContent
  }
}

/**
 * Markdownファイルパスから記事ディレクトリパスを取得
 *
 * @param markdownFilePath - Markdownファイルのパス
 * @returns 記事ディレクトリパス
 */
const getArticlePath = (markdownFilePath: string): string => {
  try {
    const submoduleDir = path.join(process.cwd(), 'src/contents/blogs')
    const relativePath = path.relative(
      submoduleDir,
      path.dirname(markdownFilePath),
    )
    return relativePath.replace(/\\/g, '/')
  } catch (error) {
    console.error(`記事パス取得でエラーが発生しました: ${error}`)
    return 'unknown'
  }
}

/**
 * 相対画像パスをpublicディレクトリの画像パスに変換
 *
 * @param imagePath - front-matterで指定された画像パス
 * @param markdownFilePath - Markdownファイルのパス
 * @returns 解決された画像パス
 */
const resolveImagePath = (
  imagePath: string,
  markdownFilePath: string,
): string => {
  try {
    if (imagePath.startsWith('http')) {
      // 絶対URLの場合はそのまま返す
      return imagePath
    }

    if (imagePath.startsWith('./')) {
      // 相対パスの場合は、publicディレクトリの対応するパスに変換
      const markdownDir = path.dirname(markdownFilePath)
      const resolvedPath = path.resolve(markdownDir, imagePath)

      // サブモジュールディレクトリからの相対パスを取得
      const submoduleDir = path.join(process.cwd(), 'src/contents/blogs')
      const relativeFromSubmodule = path.relative(submoduleDir, resolvedPath)

      // publicディレクトリの対応するパスに変換
      return `/assets/posts/${relativeFromSubmodule.replace(/\\/g, '/')}`
    }

    // その他の場合はそのまま返す
    return imagePath
  } catch (error) {
    console.error(
      `画像パス解決でエラーが発生しました (imagePath: ${imagePath}, markdownFilePath: ${markdownFilePath}): ${error}`,
    )
    return imagePath
  }
}
