/**
 * Works画像コピースクリプト
 *
 * 概要：
 * - src/content/works/ 内の画像ファイルをpublicディレクトリにコピー
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
 * works内の画像をpublicディレクトリにコピーする関数
 */
const copyWorksImages = async (): Promise<void> => {
  try {
    // パスの定義
    const worksContentDir = path.join(process.cwd(), 'src/contents/works')
    const publicWorksDir = path.join(process.cwd(), 'public/images/works')

    console.log('📁 works画像コピーを開始します...')
    console.log(`📂 ソース: ${worksContentDir}`)
    console.log(`📂 出力先: ${publicWorksDir}`)

    // worksディレクトリの存在確認
    if (!(await fs.pathExists(worksContentDir))) {
      console.warn(
        `⚠️  worksディレクトリが見つかりません: ${worksContentDir}`,
      )
      console.log('🚀 画像コピーをスキップします')
      return
    }

    // 既存の画像ディレクトリを削除（クリーンアップ）
    if (await fs.pathExists(publicWorksDir)) {
      console.log('🧹 既存の画像ディレクトリをクリーンアップ中...')
      await fs.remove(publicWorksDir)
    }

    // publicディレクトリを作成
    await fs.ensureDir(publicWorksDir)

    // 各workディレクトリを走査
    const workDirs = await fs.readdir(worksContentDir)
    let copiedCount = 0

    console.log('🖼️  画像ファイルをコピー中...')

    for (const workSlug of workDirs) {
      const workDir = path.join(worksContentDir, workSlug)
      const stats = await fs.stat(workDir)

      // ディレクトリでない場合はスキップ
      if (!stats.isDirectory()) {
        continue
      }

      // images ディレクトリの存在確認
      const imagesDir = path.join(workDir, 'images')
      if (!(await fs.pathExists(imagesDir))) {
        console.log(`  ⏭️  ${workSlug}/images が存在しないためスキップ`)
        continue
      }

      // 出力先ディレクトリを作成
      const destDir = path.join(publicWorksDir, workSlug)
      await fs.ensureDir(destDir)

      // 画像ファイルのみをフィルタリングしてコピー
      const imageFiles = await fs.readdir(imagesDir)

      for (const imageFile of imageFiles) {
        const srcPath = path.join(imagesDir, imageFile)
        const fileStats = await fs.stat(srcPath)

        // ファイルかつ画像拡張子の場合のみコピー
        if (fileStats.isFile() && IMAGE_EXTENSIONS_REGEX.test(imageFile)) {
          const destPath = path.join(destDir, imageFile)
          await fs.copy(srcPath, destPath)
          console.log(`  ✅ ${workSlug}/images/${imageFile}`)
          copiedCount++
        }
      }
    }

    console.log(
      `🎉 画像コピーが完了しました！ (${copiedCount}個のファイルをコピー)`,
    )

    // コピーされたファイルの一覧を表示（デバッグ用）
    if (await fs.pathExists(publicWorksDir)) {
      const allFiles = await getAllImageFiles(publicWorksDir)
      if (allFiles.length > 0) {
        console.log('📋 コピーされた画像ファイル:')
        allFiles.forEach((file) => {
          const relativePath = path.relative(publicWorksDir, file)
          console.log(`  📄 /images/works/${relativePath.replace(/\\/g, '/')}`)
        })
      }
    }
  } catch (error) {
    console.error('❌ works画像コピーでエラーが発生しました:', error)
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
  copyWorksImages()
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

export { copyWorksImages }
