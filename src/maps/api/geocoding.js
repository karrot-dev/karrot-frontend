// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import axios from 'axios'

export default {
  async lookupAddress (address) {
    return (await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { format: 'json', q: address },
    })).data.map(({ lat: latitude, lon: longitude, display_name: address }) => ({ latitude, longitude, address }))
  },
}
