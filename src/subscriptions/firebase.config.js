import { camelizeKeys } from '@/utils/utils'

let config
export async function getFirebaseConfig () {
  if (config) return config
  const data = await fetch('/api/config/').then(res => res.json())
  if (data.fcm) {
    config = camelizeKeys(data.fcm)
    return config
  }
  return null
}
