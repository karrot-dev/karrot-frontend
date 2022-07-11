// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import { toggles } from '@/utils/datastore/helpers'

export default {
  namespaced: true,
  modules: {
    toggle: toggles({
      placesOnMap: true,
      usersOnMap: false,
      groupsOnMap: false,
    }),
  },
}
