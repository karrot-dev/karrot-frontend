// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


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
