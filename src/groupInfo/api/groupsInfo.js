// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import axios from '@/base/api/axios'

export default {
  async get (groupId) {
    return (await axios.get(`/api/groups-info/${groupId}/`)).data
  },

  async list () {
    return (await axios.get('/api/groups-info/')).data
  },
}
