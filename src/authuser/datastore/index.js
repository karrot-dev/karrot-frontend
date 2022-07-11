// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import auth, { plugin as authPlugin } from '@/authuser/datastore/auth'
import deleteAccount, { plugin as deleteAccountPlugin } from '@/authuser/datastore/deleteAccount'
import verifymail from '@/authuser/datastore/verifymail'

export default {
  modules: {
    deleteAccount,
    verifymail,
    auth,
  },
  plugins: [
    authPlugin,
    deleteAccountPlugin,
  ],
}
