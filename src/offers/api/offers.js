import axios, { parseCursor } from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'

function convertWierdFormDataStuff (offer) {
  console.log('doing weird form data thing...')
  const data = new FormData()
  const offerWithoutPhotos = { ...offer }
  delete offerWithoutPhotos.photos
  data.append(
    'document',
    new Blob(
      [JSON.stringify(offerWithoutPhotos)],
      { type: 'application/json' },
    ),
  )
  for (const idx of Object.keys(offer.photos)) {
    const photo = offer.photos[idx]
    data.append(`image_${photo.id}`, photo.blob, `${photo.id}.png`)
  }
  return data
}

export default {

  async create (offer) {
    return convert((await axios.post('/api/offers/', convertWierdFormDataStuff(offer), {
      onUploadProgress (progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log('progress!', percentCompleted)
      },
    })).data)
  },

  async get (offerId) {
    return convert((await axios.get(`/api/offers/${offerId}/`)).data)
  },

  async list (filter) {
    const params = filter || {}
    const response = (await axios.get('/api/offers/', { params })).data
    return {
      ...response,
      next: parseCursor(response.next),
      results: convert(response.results),
    }
  },

  async save (offer) {
    return convert((await axios.patch(`/api/offers/${offer.id}/`, convertWierdFormDataStuff(offer))).data)
  },

  async conversation (offerId) {
    return convertConversation((await axios.get(`/api/offers/${offerId}/conversation/`)).data)
  },

}

export function convert (val) {
  if (Array.isArray(val)) {
    return val.map(convert)
  }
  else {
    const result = { ...val }

    // Nothing yet...

    return result
  }
}
