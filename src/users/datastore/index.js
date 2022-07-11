// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import users, { plugin as usersPlugin } from '@/users/datastore/users'

export default {
  modules: {
    users,
  },
  plugins: [
    usersPlugin,
  ],
}
