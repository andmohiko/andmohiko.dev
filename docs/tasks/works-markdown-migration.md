# Works Markdown移行実装計画

## 概要
microCMSから取得しているworksデータを、Markdownファイルベースの管理に移行します。ブログのsubmodule実装パターンを参考にしつつ、submoduleは使わずリポジトリ内で管理します。

## ディレクトリ構成

```
src/content/works/
├── work-1/
│   ├── index.md          # メタデータ + 本文
│   └── images/
│       ├── thumbnail.png
│       └── detail-1.png
├── work-2/
│   ├── index.md
│   └── images/
│       └── thumbnail.jpg
└── ...
```

## 実装ステップ

### 1. 型定義の更新
**ファイル**: `src/types/work.ts`

- Markdown由来のWork型を追加（`MarkdownWork`）
- microCMS版との互換性を保つ統合型を定義
- front-matterの型定義を追加

```typescript
// 追加する型
export type MarkdownWorkFrontMatter = {
  id: string
  title: string
  description: string
  publishAt: string
  tags: string[]
  link?: string
  thumbnail: string  // 相対パス: "./images/thumbnail.png"
}

export type MarkdownWork = {
  id: string
  slug: string
  title: string
  description: string
  publishAt: string
  tags: string[]
  link?: string
  thumbnail: {
    url: string      // 絶対パス: "/images/works/{slug}/thumbnail.png"
    width: number
    height: number
  }
  body: string       // Markdown本文
  source: 'markdown' | 'microcms'
}

// 既存のWork型と統合
export type AggregatedWork = Work | MarkdownWork
```

### 2. Markdownパーサーの実装
**ファイル**: `src/lib/works-markdown.ts`（新規作成）

実装する関数:
- `getAllMarkdownWorks()`: 全works取得
- `getMarkdownWorkBySlug(slug: string)`: slug指定で取得
- `parseWorkMarkdown(filePath: string)`: 個別Markdownファイルのパース
- `convertImagePath(relativePath: string, slug: string)`: 画像パス変換

処理フロー:
1. `src/content/works/` 配下のディレクトリをスキャン
2. 各ディレクトリの `index.md` を読み込み
3. `gray-matter` でfront-matterと本文を分離
4. 相対パス画像を絶対パスに変換
5. Work型に変換して返却

画像パス変換ロジック:
```
入力: "./images/thumbnail.png"
slug: "work-1"
出力: "/images/works/work-1/thumbnail.png"
```

### 3. 画像コピースクリプトの作成
**ファイル**: `scripts/copy-works-images.ts`（新規作成）

参考: `scripts/copy-submodule-images.ts`

処理内容:
1. `src/content/works/*/images/` を走査
2. `public/images/works/{slug}/` にコピー
3. 既存ファイルは上書き
4. エラーハンドリング

実装例:
```typescript
import * as fs from 'fs'
import * as path from 'path'

const WORKS_DIR = path.join(process.cwd(), 'src/content/works')
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public/images/works')

export const copyWorksImages = () => {
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true })
  }

  // src/content/works/ 配下のディレクトリを走査
  const workDirs = fs.readdirSync(WORKS_DIR)

  workDirs.forEach((slug) => {
    const imagesDir = path.join(WORKS_DIR, slug, 'images')
    if (!fs.existsSync(imagesDir)) return

    const destDir = path.join(PUBLIC_IMAGES_DIR, slug)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    // 画像ファイルをコピー
    const images = fs.readdirSync(imagesDir)
    images.forEach((image) => {
      const src = path.join(imagesDir, image)
      const dest = path.join(destDir, image)
      fs.copyFileSync(src, dest)
      console.log(`Copied: ${slug}/images/${image}`)
    })
  })
}

copyWorksImages()
```

### 4. package.json の更新
**ファイル**: `package.json`

```json
{
  "scripts": {
    "copy:images": "tsx scripts/copy-submodule-images.ts && tsx scripts/copy-works-images.ts",
    "dev": "pnpm copy:images && next dev --turbopack",
    "build": "pnpm copy:images && next build"
  }
}
```

### 5. データ取得層の統合
**ファイル**: `src/lib/works-aggregator.ts`（新規作成）

参考: `src/lib/blog-aggregator.ts`

実装する関数:
- `getAllAggregatedWorks()`: microCMS + Markdown の全works取得
- `getAggregatedWorkBySlug(slug: string)`: slug指定で取得（両ソースから検索）

```typescript
import { getAllWorks } from './microcms'
import { getAllMarkdownWorks } from './works-markdown'
import type { AggregatedWork } from '@/types/work'

export async function getAllAggregatedWorks(): Promise<AggregatedWork[]> {
  const microCmsWorks = await getAllWorks()
  const markdownWorks = await getAllMarkdownWorks()

  // microCMS版にsourceフィールドを追加
  const microCmsWorksWithSource = microCmsWorks.map(work => ({
    ...work,
    source: 'microcms' as const
  }))

  // publishAt（降順）でソート
  return [...microCmsWorksWithSource, ...markdownWorks]
    .sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime())
}

export async function getAggregatedWorkBySlug(
  slug: string
): Promise<{ work: AggregatedWork; previousSlug?: string; nextSlug?: string }> {
  const allWorks = await getAllAggregatedWorks()
  const currentIndex = allWorks.findIndex((work) => work.id === slug)

  if (currentIndex === -1) {
    throw new Error(`Work not found: ${slug}`)
  }

  return {
    work: allWorks[currentIndex],
    previousSlug: allWorks[currentIndex - 1]?.id,
    nextSlug: allWorks[currentIndex + 1]?.id,
  }
}
```

### 6. コンポーネントの更新

#### 6.1 WorkContentコンポーネント
**ファイル**: `src/app/@modal/(.)works/[slug]/components/work-content/index.tsx`

現状: `dangerouslySetInnerHTML` でHTMLを表示

変更内容:
- work.source で表示方法を分岐
- Markdown版は `ReactMarkdown` で表示
- ブログの `BlogContent` コンポーネントを参考

```typescript
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

// コンポーネント内
{work.source === 'markdown' ? (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeRaw, rehypeSanitize]}
  >
    {work.body}
  </ReactMarkdown>
) : (
  <div dangerouslySetInnerHTML={{ __html: work.body }} />
)}
```

#### 6.2 WorkItemコンポーネント
**ファイル**: `src/app/@main/components/work-item/index.tsx`

変更内容:
- `thumbnailUrl` アクセスの型安全性を向上
- Markdown版の `thumbnail.url` にも対応

```typescript
const thumbnailUrl = 'thumbnail' in work && typeof work.thumbnail === 'object'
  ? work.thumbnail.url
  : work.thumbnail
```

### 7. generateStaticParams の更新
**ファイル**:
- `src/app/@modal/(.)works/[slug]/page.tsx`
- `src/app/@modal/works/[slug]/page.tsx`

変更内容:
```typescript
import { getAllAggregatedWorks } from '@/lib/works-aggregator'

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const works = await getAllAggregatedWorks()
    // 以下は既存のまま
  } catch (error) {
    // ...
  }
}
```

### 8. generateMetadata の更新
**ファイル**: 同上

変更内容:
```typescript
import { getAggregatedWorkBySlug } from '@/lib/works-aggregator'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  const { work } = await getAggregatedWorkBySlug(slug)
  // 以下は既存のまま（thumbnail.url アクセスに対応）
}
```

### 9. ページコンポーネントの更新
**ファイル**:
- `src/app/@main/page.tsx`
- `src/app/@modal/(.)works/[slug]/page.tsx`
- `src/app/@modal/works/[slug]/page.tsx`

変更内容: `getAllWorks()` → `getAllAggregatedWorks()` に置き換え

## 必要な依存パッケージ
すべて既存でインストール済み:
- `gray-matter`: front-matterパース
- `react-markdown`: Markdown表示
- `remark-gfm`: GitHub Flavored Markdown
- `rehype-raw`, `rehype-sanitize`: HTML埋め込み対応

## Front-matter 例

```yaml
---
id: my-portfolio-site
title: "ポートフォリオサイト"
description: "Next.js App Routerを活用したポートフォリオサイト"
publishAt: "2024-01-15"
tags:
  - Next.js
  - TypeScript
  - CSS Modules
link: "https://andmohiko.dev"
thumbnail: "./images/thumbnail.png"
---

# プロジェクト詳細

このプロジェクトは、Next.js 15のApp Routerを使用して...

## 技術スタック

- Next.js 15
- TypeScript
- CSS Modules

## 実装のポイント

Parallel RoutesとIntercepting Routesを活用して...
```

## 移行フロー

### Phase 1: 実装準備
1. ✅ 型定義作成（`src/types/work.ts`）
2. ✅ Markdownパーサー実装（`src/lib/works-markdown.ts`）
3. ✅ 画像コピースクリプト作成（`scripts/copy-works-images.ts`）
4. ✅ package.json更新
5. ✅ データ統合層作成（`src/lib/works-aggregator.ts`）

### Phase 2: コンポーネント更新
6. ✅ WorkContentコンポーネント更新
7. ✅ WorkItemコンポーネント更新
8. ✅ generateStaticParams更新
9. ✅ generateMetadata更新
10. ✅ ページコンポーネント更新

### Phase 3: テストと移行
11. ✅ テスト用Markdownファイル作成（`src/content/works/test-work/`）
12. ✅ ビルド実行・動作確認
13. ✅ 既存worksをMarkdownに移行
14. ⏸️ microCMS関連コード削除（必要に応じて）

## 実装順序
1. 型定義作成
2. Markdownパーサー実装
3. 画像コピースクリプト作成
4. package.json更新
5. データ統合層作成
6. コンポーネント更新
7. generateStaticParams/Metadata更新
8. ページコンポーネント更新
9. テスト用Markdownファイル作成
10. 動作確認

## 注意事項

### 既存機能の互換性
- microCMS版のworksも引き続き動作するように実装
- 段階的な移行を可能にする
- ソース（microCMS/Markdown）は `source` フィールドで識別

### 画像の取り扱い
- Markdown内の相対パス: `./images/thumbnail.png`
- ビルド時にコピー: `public/images/works/{slug}/thumbnail.png`
- Next.js Image コンポーネントで最適化

### パフォーマンス
- SSG（静的サイト生成）を維持
- ビルド時に全ページ生成
- CDNキャッシュによる高速配信

## 将来の拡張

### オプション機能
- [ ] front-matterのバリデーション（Zod等）
- [ ] Markdown内画像の自動最適化
- [ ] 開発時のホットリロード対応
- [ ] CMS管理画面（Tina CMS等）との統合

### 削除可能なコード
microCMSを完全に廃止する場合:
- `src/lib/microcms.ts` の `getAllWorks()` 関数
- `MICROCMS_SERVICE_DOMAIN`, `MICROCMS_API_KEY` 環境変数
- `src/lib/works-aggregator.ts` のmicroCMS統合処理

## 参考実装
- ブログsubmodule実装: `src/lib/blog-submodule.ts`
- ブログ統合: `src/lib/blog-aggregator.ts`
- 画像コピー: `scripts/copy-submodule-images.ts`
