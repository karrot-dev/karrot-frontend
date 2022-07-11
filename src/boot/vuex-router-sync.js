// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { sync } from 'vuex-router-sync'

export default async function ({ store: datastore, router }) {
  sync(datastore, router)
}
