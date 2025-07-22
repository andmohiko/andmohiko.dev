/**
 * 画像ブラー効果用のユーティリティ
 *
 * 画像の遅延読み込み時に表示するブラー効果を提供します。
 * 汎用的なグレー画像をbase64エンコードしたデータURIを使用し、
 * パフォーマンスを向上させます。
 *
 * 主な仕様：
 * - 10x10pxの小さなグレー画像
 * - base64エンコード済みデータURI
 * - ファイルサイズ最小限
 *
 * 制限事項：
 * - 全画像で同一のブラー効果
 * - カラーバリエーションなし
 */

/**
 * 汎用ブラー画像のデータURI
 * 10x10pxのグレー画像をbase64エンコード
 */
const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHw/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAhEQACAQIEBwAAAAAAAAAAAAABAgADEQQFIWGx0eHw8f/aAAwDAQACEQMRAD8A0XqFDTiH2C3IjJrpQjKLPEcDhM3xaZQv6XRTE='

/**
 * 汎用ブラー画像のデータURIを取得
 *
 * @returns {string} ブラー効果用のデータURI
 */
export const getBlurPlaceholder = (): string => {
  return BLUR_DATA_URL
}

/**
 * 画像サイズに基づくsizes属性を生成
 *
 * @param {number} maxWidth - 最大幅（px）
 * @returns {string} レスポンシブ用sizes属性
 */
export const generateImageSizes = (maxWidth: number = 276): string => {
  return `(max-width: 900px) 100vw, ${maxWidth}px`
}
