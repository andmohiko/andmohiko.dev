/**
 * サブモジュール画像コピースクリプト
 *
 * 概要：
 * - サブモジュール内の画像ファイルをpublicディレクトリにコピー
 * - ビルド時に実行されて画像をアクセス可能にする
 * - 既存の画像ディレクトリをクリーンアップしてから新しい画像をコピー
 *
 * 制限事項：
 * - Node.js環境でのみ実行可能
 * - 画像形式は png, jpg, jpeg, gif, svg, webp のみサポート
 */
import fs from 'fs-extra'
import path from 'path'

/**
 * サポートされている画像拡張子の正規表現
 */
const IMAGE_EXTENSIONS_REGEX = /\.(png|jpe?g|gif|svg|webp)$/i

/**
 * サブモジュール内の画像をpublicディレクトリにコピーする関数
 */
const copySubmoduleImages = async (): Promise<void> => {
  try {
    // パスの定義
    const submoduleContentDir = path.join(process.cwd(), 'src/contents/blogs')
    const publicAssetsDir = path.join(process.cwd(), 'public/assets/posts')

    console.log('📁 サブモジュール画像コピーを開始します...')
    console.log(`📂 ソース: ${submoduleContentDir}`)
    console.log(`📂 出力先: ${publicAssetsDir}`)

    // サブモジュールディレクトリの存在確認
    if (!(await fs.pathExists(submoduleContentDir))) {
      console.warn(
        `⚠️  サブモジュールディレクトリが見つかりません: ${submoduleContentDir}`,
      )
      console.log('🚀 画像コピーをスキップします')
      return
    }

    // 既存の画像ディレクトリを削除（クリーンアップ）
    if (await fs.pathExists(publicAssetsDir)) {
      console.log('🧹 既存の画像ディレクトリをクリーンアップ中...')
      await fs.remove(publicAssetsDir)
    }

    // 画像ファイルのみをフィルタリングしてコピー
    console.log('🖼️  画像ファイルをコピー中...')

    let copiedCount = 0

    await fs.copy(submoduleContentDir, publicAssetsDir, {
      filter: async (src: string, dest: string) => {
        try {
          const stats = await fs.stat(src)

          // ディレクトリの場合は通す
          if (stats.isDirectory()) {
            return true
          }

          // ファイルの場合は画像拡張子をチェック
          if (stats.isFile() && IMAGE_EXTENSIONS_REGEX.test(src)) {
            const relativePath = path.relative(submoduleContentDir, src)
            console.log(`  ✅ ${relativePath}`)
            copiedCount++
            return true
          }

          return false
        } catch (error) {
          console.error(`❌ ファイル処理エラー (${src}):`, error)
          return false
        }
      },
    })

    console.log(
      `🎉 画像コピーが完了しました！ (${copiedCount}個のファイルをコピー)`,
    )

    // コピーされたファイルの一覧を表示（デバッグ用）
    if (await fs.pathExists(publicAssetsDir)) {
      const allFiles = await getAllImageFiles(publicAssetsDir)
      if (allFiles.length > 0) {
        console.log('📋 コピーされた画像ファイル:')
        allFiles.forEach((file) => {
          const relativePath = path.relative(publicAssetsDir, file)
          console.log(`  📄 /assets/posts/${relativePath.replace(/\\/g, '/')}`)
        })
      }
    }
  } catch (error) {
    console.error('❌ サブモジュール画像コピーでエラーが発生しました:', error)
    process.exit(1)
  }
}

/**
 * 指定されたディレクトリから再帰的に画像ファイルを取得
 *
 * @param dirPath - 検索対象のディレクトリパス
 * @returns 画像ファイルパスの配列
 */
const getAllImageFiles = async (dirPath: string): Promise<string[]> => {
  const imageFiles: string[] = []

  try {
    const items = await fs.readdir(dirPath)

    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stats = await fs.stat(fullPath)

      if (stats.isDirectory()) {
        // ディレクトリの場合は再帰的に検索
        const subFiles = await getAllImageFiles(fullPath)
        imageFiles.push(...subFiles)
      } else if (stats.isFile() && IMAGE_EXTENSIONS_REGEX.test(fullPath)) {
        // 画像ファイルの場合は配列に追加
        imageFiles.push(fullPath)
      }
    }
  } catch (error) {
    console.error(`ディレクトリ読み込みエラー (${dirPath}):`, error)
  }

  return imageFiles
}

/**
 * スクリプトのメイン実行部分
 */
if (require.main === module) {
  copySubmoduleImages()
    .then(() => {
      console.log('✨ スクリプトが正常に完了しました')
    })
    .catch((error) => {
      console.error(
        '💥 スクリプト実行中に予期しないエラーが発生しました:',
        error,
      )
      process.exit(1)
    })
}

export { copySubmoduleImages }
