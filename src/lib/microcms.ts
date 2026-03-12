import { createClient } from 'microcms-js-sdk'
import type { Entry } from '@/types/entry'

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
