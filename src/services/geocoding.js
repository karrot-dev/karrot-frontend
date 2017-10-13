import axios from 'axios'

export default {
  async lookupAddress (address) {
    return (await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { format: 'json', q: address },
    })).data.map(({ lat: latitude, lon: longitude, display_name: address }) => ({ latitude, longitude, address }))
  },
}
