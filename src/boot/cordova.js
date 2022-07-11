// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

if (process.env.MODE === 'cordova') {
  require('@/utils/cordova/setBaseURL')
}

export default async function () {
  if (process.env.MODE === 'cordova') {
    // requires datastore and router
    require('@/utils/cordova')
  }
}
