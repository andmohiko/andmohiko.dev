import * as fs from 'fs'
import * as path from 'path'
import { getAllWorks } from '../src/lib/microcms'
import type { Work } from '../src/types/work'

const WORKS_DIR = path.join(process.cwd(), 'src/contents/works')

/**
 * microCMSのHTMLをMarkdownに変換
 * 簡易的な変換（必要に応じて調整）
 */
const htmlToMarkdown = (html: string): string => {
  let markdown = html

  // HTMLタグを削除または変換
  markdown = markdown
    // 見出しタグ（id属性付きも対応）
    .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/g, '#### $1\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/g, '##### $1\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/g, '###### $1\n')
    // パラグラフ
    .replace(/<p[^>]*>(.*?)<\/p>/gs, '$1\n\n')
    // 強調
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<b>(.*?)<\/b>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<i>(.*?)<\/i>/g, '*$1*')
    // リンク
    .replace(/<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
    // リスト
    .replace(/<ul[^>]*>/g, '')
    .replace(/<\/ul>/g, '\n')
    .replace(/<ol[^>]*>/g, '')
    .replace(/<\/ol>/g, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gs, '- $1\n')
    // コード
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<pre[^>]*>(.*?)<\/pre>/gs, '```\n$1\n```\n')
    // 改行
    .replace(/<br\s*\/?>/g, '\n')
    // 水平線
    .replace(/<hr\s*\/?>/g, '\n---\n')
    // その他のタグを削除（div, spanなど）
    .replace(/<\/?div[^>]*>/g, '')
    .replace(/<\/?span[^>]*>/g, '')
    .replace(/<\/?section[^>]*>/g, '')
    .replace(/<\/?article[^>]*>/g, '')

  // 複数の改行を整理
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim()

  // HTML entities をデコード
  markdown = markdown
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  return markdown
}

/**
 * 画像URLをダウンロードしてローカルに保存
 */
const downloadImage = async (
  imageUrl: string,
  destPath: string
): Promise<void> => {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // ディレクトリが存在しない場合は作成
    const dir = path.dirname(destPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(destPath, buffer)
    console.log(`  ✓ Downloaded image: ${path.basename(destPath)}`)
  } catch (error) {
    console.error(`  ✗ Failed to download image from ${imageUrl}:`, error)
  }
}

/**
 * WorkをMarkdownファイルとして保存
 */
const saveWorkAsMarkdown = async (work: Work): Promise<void> => {
  const workDir = path.join(WORKS_DIR, work.id)
  const imagesDir = path.join(workDir, 'images')
  const markdownPath = path.join(workDir, 'index.md')

  // ディレクトリ作成
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }

  // サムネイル画像をダウンロード
  if (work.thumbnail?.url) {
    const imageUrl = work.thumbnail.url.startsWith('//')
      ? `https:${work.thumbnail.url}`
      : work.thumbnail.url
    const ext = path.extname(new URL(imageUrl).pathname) || '.png'
    const thumbnailPath = path.join(imagesDir, `thumbnail${ext}`)
    await downloadImage(imageUrl, thumbnailPath)
  }

  // front-matter作成
  const frontMatter = `---
id: ${work.id}
title: "${work.title}"
description: "${work.description}"
publishAt: "${work.publishAt}"
tags:
${work.tags.map((tag) => `  - ${tag}`).join('\n')}${work.link ? `\nlink: "${work.link}"` : ''}
thumbnail: "./images/thumbnail${path.extname(new URL(work.thumbnail?.url || '').pathname) || '.png'}"
---
`

  // bodyをMarkdownに変換
  const bodyMarkdown = htmlToMarkdown(work.body || '')

  // Markdownファイルを保存
  const content = `${frontMatter}\n${bodyMarkdown}\n`
  fs.writeFileSync(markdownPath, content, 'utf-8')

  console.log(`✓ Saved: ${work.id}`)
}

/**
 * メイン処理
 */
const migrateMicroCMSWorks = async () => {
  console.log('🚀 Starting microCMS works migration...\n')

  try {
    // microCMSから全worksを取得
    console.log('📥 Fetching works from microCMS...')
    const works = await getAllWorks()
    console.log(`   Found ${works.length} works\n`)

    // 各workをMarkdownファイルとして保存
    console.log('💾 Saving works as Markdown files...\n')
    for (const work of works) {
      await saveWorkAsMarkdown(work)
    }

    console.log(`\n✅ Migration completed! ${works.length} works saved to ${WORKS_DIR}`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateMicroCMSWorks()
