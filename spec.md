# 📘 Project Specification: Portfolio & Blog Site

## 0. Overview

本プロジェクトは、ポートフォリオとブログを併設したWebサイトであり、  
Next.js App Router、Parallel Routes、Intercepting Routes、SSGを活用して、  
UXとパフォーマンスを両立した構成を実現する。

- 画面右：常に共通UI（ロゴ・ナビゲーション）
- 画面左：ブログ or ポートフォリオの一覧
- 詳細ページは右側モーダル表示（URLは更新）

---

## 1. 技術スタック

| 項目 | 使用技術 |
|------|----------|
| フレームワーク | Next.js 14+ (App Router) |
| ルーティング | Parallel Routes + Intercepting Routes |
| アニメーション | framer-motion |
| スタイル | CSS Modules |
| デプロイ | Vercel |
| データ取得 | Contentful, microCMS |
| ビルド方式 | Static Site Generation（SSG）|

---

## 2. ディレクトリ構成

```
app/
├─ @main/
│  ├─ blog/
│  │  ├─ page.tsx
│  │  └─ [slug]/page.tsx
│  └─ work/
│     ├─ page.tsx
│     └─ [slug]/page.tsx
├─ @modal/
│  └─ blog/[slug]/page.tsx
│  └─ work/[slug]/page.tsx
├─ layout.tsx
└─ page.tsx
```

---

## 3. 各画面の構成と遷移仕様

### 🟪 共通レイアウト（`layout.tsx`）

- 左：`@main` スロット（ブログ or 作品一覧）
- 右：共通UI（ナビゲーション等）
- `@modal` は右側に重ねて表示（モーダル）

### 🟦 ブログ画面

- `/blog` → 一覧
- `/blog/modal/:slug` → モーダルで詳細表示
- `/blog/:slug` → 通常の全画面表示も可能

### 🟥 ポートフォリオ画面

- `/work` → 一覧
- `/work/modal/:slug` → モーダルで詳細表示
- `/work/:slug` → 通常の全画面表示も可能

---

## 4. アニメーション仕様

| 対象 | 実装 |
|------|------|
| 左カラムのページ遷移 | framer-motion + AnimatePresence でフェード/スライド |
| モーダル開閉 | motion.div + router.push()/back() |
| ナビのカレント表示 | layoutId によるスライドアニメーション付きインジケーター |

---

## 5. データ取得と SSG 方針

### 基本ポリシー：全ページをSSGでビルド

- 一覧ページ → `dynamic = 'force-static'`
- 詳細ページ → `generateStaticParams()` により全slugをビルド時列挙
- モーダルページ → 通常ページと同様にSSG

```ts
// 例: generateStaticParams()
export async function generateStaticParams() {
  const blogs = await fetchBlogsFromCMS();
  return blogs.map((b) => ({ slug: b.slug }));
}
```

---

## 6. スムーズな遷移を実現する工夫

- `router.push()` を使ってアニメーション後にルーティング
- `router.prefetch()` による事前データ取得
- `@modal/[slug]/loading.tsx` によるローディングUI
- `shallow: true` でURLのみ変更し、状態を保持

---

## 7. TODOリスト

- [ ] `app/layout.tsx`：左右カラム＋スロット
- [ ] `app/@main/blog/page.tsx`：ブログ一覧
- [ ] `app/@main/blog/[slug]/page.tsx`：ブログ詳細
- [ ] `app/@modal/blog/[slug]/page.tsx`：モーダル詳細（ブログ）
- [ ] `app/@main/work/page.tsx`：ポートフォリオ一覧
- [ ] `app/@main/work/[slug]/page.tsx`：ポートフォリオ詳細
- [ ] `app/@modal/work/[slug]/page.tsx`：モーダル詳細（作品）
- [ ] `Navigation.tsx`：カレントインジケーター付きナビ
- [ ] `lib/cms.ts`：CMSからのデータ取得
- [ ] framer-motion / Tailwind CSS の導入と初期化

---

## 備考

- UIはすでに提供済みのデザイン画像をベースに実装
- 動的コンテンツはないため、完全SSG構成が最適
