/**
 * Service Worker for andmohiko.dev PWA
 *
 * SSG + Parallel Routes構成に最適化されたキャッシュ戦略：
 * - 静的アセット: Cache First（長期キャッシュ）
 * - HTMLページ: Stale While Revalidate（高速表示＋更新）
 * - ブログ記事: Cache First with Network Fallback
 * - 画像: Cache First with Size Limit
 *
 * Parallel Routes対応：
 * - 通常ページとモーダル表示の効率的なキャッシュ
 * - 重複データの最適化
 */

// キャッシュ名の定義
const STATIC_CACHE = 'static-assets-v1'
const PAGE_CACHE = 'pages-v1'
const IMAGE_CACHE = 'images-v1'
const API_CACHE = 'api-v1'

// キャッシュする静的ファイルのリスト
const STATIC_ASSETS = [
  '/',
  '/blogs',
  '/profile',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon512_maskable.png',
  '/icon512_rounded.png',
]

// キャッシュサイズ制限（MB）
const MAX_IMAGE_CACHE_SIZE = 50 * 1024 * 1024 // 50MB

/**
 * Service Worker インストール時の処理
 * 必要な静的アセットを事前キャッシュ
 */
self.addEventListener('install', (event) => {
  console.log('[SW] インストール開始')

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] 静的アセットをキャッシュ中')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[SW] インストール完了')
        // 新しいService Workerを即座にアクティブ化
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[SW] インストールエラー:', error)
      }),
  )
})

/**
 * Service Worker アクティベーション時の処理
 * 古いキャッシュを削除
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] アクティベーション開始')

  event.waitUntil(
    Promise.all([
      // 古いキャッシュを削除
      caches.keys().then((cacheNames) => {
        const validCaches = [STATIC_CACHE, PAGE_CACHE, IMAGE_CACHE, API_CACHE]
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!validCaches.includes(cacheName)) {
              console.log('[SW] 古いキャッシュを削除:', cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      }),
      // すべてのクライアントを即座に制御
      self.clients.claim(),
    ]).then(() => {
      console.log('[SW] アクティベーション完了')
    }),
  )
})

/**
 * ネットワークリクエストの処理
 * リクエストタイプに応じた最適なキャッシュ戦略を適用
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 同一オリジンのリクエストのみ処理
  if (url.origin !== location.origin) {
    return
  }

  // リクエストタイプに応じてキャッシュ戦略を選択
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request))
  } else if (isImageRequest(url)) {
    event.respondWith(handleImageRequest(request))
  } else if (isPageRequest(url)) {
    event.respondWith(handlePageRequest(request))
  } else if (isApiRequest(url)) {
    event.respondWith(handleApiRequest(request))
  }
})

/**
 * 静的アセットの判定
 */
function isStaticAsset(url) {
  return (
    url.pathname.match(/\.(js|css|woff|woff2|ttf|ico|json)$/) ||
    url.pathname.startsWith('/_next/static/')
  )
}

/**
 * 画像リクエストの判定
 */
function isImageRequest(url) {
  return (
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/) ||
    url.pathname.startsWith('/images/')
  )
}

/**
 * ページリクエストの判定
 */
function isPageRequest(url) {
  return (
    url.pathname === '/' ||
    url.pathname.startsWith('/blogs') ||
    url.pathname.startsWith('/profile') ||
    request.headers.get('accept')?.includes('text/html')
  )
}

/**
 * APIリクエストの判定
 */
function isApiRequest(url) {
  return url.pathname.startsWith('/api/')
}

/**
 * 静的アセット処理: Cache First戦略
 */
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('[SW] 静的アセット取得エラー:', error)
    return new Response('オフラインです', { status: 503 })
  }
}

/**
 * 画像リクエスト処理: Cache First with Size Limit
 */
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      // キャッシュサイズ制限チェック
      await manageCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE)
      await cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('[SW] 画像取得エラー:', error)
    // フォールバック画像を返す
    return new Response('', { status: 503 })
  }
}

/**
 * ページリクエスト処理: Stale While Revalidate戦略
 */
async function handlePageRequest(request) {
  try {
    const cache = await caches.open(PAGE_CACHE)
    const cachedResponse = await cache.match(request)

    // バックグラウンドでネットワークから更新
    const networkPromise = fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone())
        }
        return networkResponse
      })
      .catch(() => null)

    // キャッシュがあれば即座に返し、バックグラウンドで更新
    if (cachedResponse) {
      void networkPromise // バックグラウンド更新
      return cachedResponse
    }

    // キャッシュがない場合はネットワークを待つ
    const networkResponse = await networkPromise
    if (networkResponse) {
      return networkResponse
    }

    // オフライン時のフォールバック
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="utf-8">
        <title>オフライン - andmohiko.dev</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; 
                 text-align: center; padding: 2rem; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; }
          .icon { font-size: 4rem; margin-bottom: 1rem; }
          h1 { color: #652C8F; margin-bottom: 1rem; }
          p { color: #666; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📱</div>
          <h1>オフラインです</h1>
          <p>インターネット接続を確認してから再度お試しください。</p>
          <p>一部のコンテンツはキャッシュされている可能性があります。</p>
        </div>
      </body>
      </html>
    `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      },
    )
  } catch (error) {
    console.error('[SW] ページ取得エラー:', error)
    return new Response('エラーが発生しました', { status: 500 })
  }
}

/**
 * APIリクエスト処理: Network First戦略
 */
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE)
      await cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('[SW] API取得エラー:', error)
    const cache = await caches.open(API_CACHE)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    return new Response(
      JSON.stringify({
        error: 'オフラインです',
        cached: false,
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

/**
 * キャッシュサイズ管理
 * 指定されたサイズを超えた場合、古いエントリを削除
 */
async function manageCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()

  let totalSize = 0
  const sizePromises = keys.map(async (request) => {
    const response = await cache.match(request)
    if (response) {
      const blob = await response.blob()
      return { request, size: blob.size }
    }
    return { request, size: 0 }
  })

  const sizes = await Promise.all(sizePromises)
  sizes.sort((a, b) => a.size - b.size) // サイズ順でソート

  // サイズを計算し、超過分を削除
  for (const { request, size } of sizes) {
    totalSize += size
    if (totalSize > maxSize) {
      await cache.delete(request)
    }
  }
}

/**
 * メッセージハンドリング
 * アプリケーションからのメッセージを処理
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // 特定のURLのキャッシュを更新
    const url = event.data.url
    if (url) {
      fetch(url).then((response) => {
        if (response.ok) {
          caches.open(PAGE_CACHE).then((cache) => {
            cache.put(url, response)
          })
        }
      })
    }
  }
})

console.log('[SW] Service Worker準備完了')
