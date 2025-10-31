/**
 * Contentfulクライアントを作成・管理するためのモジュール
 *
 * @fileoverview
 * - Contentfulからブログ記事を取得するための関数を提供
 * - 環境変数からContentfulの認証情報を取得してクライアントを作成
 *
 * @module contentful
 */

import { createClient } from 'contentful'
import type { ContentfulBlog } from '~/types/blog'

/**
 * デフォルトのContentful設定
 * 環境変数から取得したスペースIDとアクセストークンを使用
 */
const defaultConfig = {
	CTF_SPACE_ID: import.meta.env.CTF_SPACE_ID,
	CTF_CDA_ACCESS_TOKEN: import.meta.env.CTF_CDA_ACCESS_TOKEN,
}

/**
 * Contentfulクライアントを作成する関数
 *
 * @param {Object} config - Contentful設定オブジェクト（オプション）
 * @param {string} config.CTF_SPACE_ID - ContentfulスペースID
 * @param {string} config.CTF_CDA_ACCESS_TOKEN - Contentful CDAアクセストークン
 * @returns {Object} Contentfulクライアントインスタンス
 */
export const createContentfulClient = (config = defaultConfig) => {
	return createClient({
		space: config.CTF_SPACE_ID!,
		accessToken: config.CTF_CDA_ACCESS_TOKEN!,
	})
}

export const getAllBlogPosts = async (): Promise<Array<ContentfulBlog>> => {
	const posts = await createContentfulClient()
		.getEntries({
			content_type: import.meta.env.CTF_BLOG_POST_TYPE_ID!,
			order: '-fields.publishedAt',
		})
		.then((entries) => {
			return {
				posts: entries.items,
			}
		})
		.catch(console.error)
	return posts.posts
}

export const getBlogById = async (slug: string): Promise<ContentfulBlog> => {
	const posts = await createContentfulClient()
		.getEntries({
			content_type: import.meta.env.CTF_BLOG_POST_TYPE_ID!,
			order: '-fields.publishedAt',
		})
		.then((entries) =>
			entries.items.filter((item) => item.fields.slug === slug),
		)
		.catch(console.error)
	return posts[0]
}
