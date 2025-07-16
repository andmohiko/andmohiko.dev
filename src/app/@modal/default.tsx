/**
 * @modalスロット用デフォルトページ
 *
 * このコンポーネントは、@modalスロットでルートがマッチしない場合に
 * 表示されるフォールバックページです。
 *
 * 主な仕様：
 * - モーダルが表示されていない場合は何も表示しない
 * - Parallel Routesのフォールバック表示
 *
 * 制限事項：
 * - Next.js App RouterのParallel Routesが必要
 */

import React from 'react'

/**
 * モーダルスロットのデフォルトコンポーネント
 *
 * @returns {null} 何も表示しない
 */
const ModalDefault: React.FC = () => {
  return null
}

export default ModalDefault
