import { createClient } from 'microcms-js-sdk'
import type { Entry } from '@/types/entry'
import type { Work } from '@/types/work'

export const microcmsClient = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY!,
})

export const getAllEntries = async (): Promise<Array<Entry>> => {
  const data = await microcmsClient.get({ endpoint: 'entries' })
  return data.contents
}

export const getEntryById = async (id: string) =>
  await microcmsClient.get({ endpoint: 'entries', contentId: id })

export const getAllWorks = async (): Promise<Array<Work>> => {
  const data = await microcmsClient.get({
    endpoint: 'works',
    queries: { orders: '-startAt', limit: 100 },
  })
  return data.contents
}
