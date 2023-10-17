import { createClient } from 'microcms-js-sdk'
import type { Entry } from '~/types/entry'

export const cmsClient = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
})

export const getAllEntries = async (): Promise<Array<Entry>> => {
  const data = await cmsClient.get({ endpoint: 'entries' })
  return data.contents
}

export const getEntryById = async (id: string) =>
  await cmsClient.get({ endpoint: 'entries', contentId: id })
