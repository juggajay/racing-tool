'use server'
// import { getCloudflareContext } from '@opennextjs/cloudflare'
import { headers } from 'next/headers'

// 增加计数并记录访问
export async function incrementAndLog() {
  // const cf = await getCloudflareContext()
  const headersList = headers()

  // Return placeholder data instead of using Cloudflare DB
  return {
    count: 1,
    recentAccess: [{ accessed_at: new Date().toISOString() }]
  } as { count: number; recentAccess: { accessed_at: string }[] }
}

// 获取当前计数和最近访问
export async function getStats() {
  // Return placeholder data instead of using Cloudflare DB
  return {
    count: 0,
    recentAccess: [{ accessed_at: new Date().toISOString() }]
  } as { count: number; recentAccess: { accessed_at: string }[] }
}
