// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import axios from '@/base/api/axios'

export default {

  async create (data) {
    return (await axios.post('/api/subscriptions/push/', data)).data
  },

  async list () {
    return (await axios.get('/api/subscriptions/push/')).data
  },

  async delete (subscriptionId) {
    return (await axios.delete(`/api/subscriptions/push/${subscriptionId}/`)).data
  },

}
