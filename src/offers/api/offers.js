import axios, { parseCursor } from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'

async function toFormData (sourceOffer) {
  const data = new FormData()
  const offer = { ...sourceOffer } // clone as we will modify this object

  if (offer.images) {
    const blobs = {}
    for (const idx of Object.keys(offer.images)) {
      const image = offer.images[idx]
      if (image.toBlob) {
        blobs[`images.${idx}.image`] = await image.toBlob()
        delete image.toBlob
      }
      delete image.imageUrls
    }
    for (const key of Object.keys(blobs)) {
      data.append(key, blobs[key], `${key}.png`)
    }
  }

  data.append(
    'document',
    new Blob(
      [JSON.stringify(offer)],
      { type: 'application/json' },
    ),
  )

  return data
}

export default {

  async create (offer) {
    return convert((await axios.post('/api/offers/', await toFormData(offer), {
      onUploadProgress (progressEvent) {
        // TODO: check this works and see if it's useful
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log('create progress!', percentCompleted)
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
    return convert((await axios.patch(`/api/offers/${offer.id}/`, await toFormData(offer), {
      onUploadProgress (progressEvent) {
        // TODO: check this works and see if it's useful
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log('save progress!', percentCompleted)
      },
    })).data)
  },

  async conversation (offerId) {
    return convertConversation((await axios.get(`/api/offers/${offerId}/conversation/`)).data)
  },

}

export function convert (val) {
  return val // nothing to convert!
}
