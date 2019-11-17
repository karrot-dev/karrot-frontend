import axios, { parseCursor } from '@/base/api/axios'
import { convert as convertConversation } from '@/messages/api/conversations'

const MIME_TYPE = 'image/jpeg'
const EXTENSION = '.jpg'

function withoutKeys (...keys) {
  return obj => {
    const copy = { ...obj }
    for (const key of keys) {
      delete copy[key]
    }
    return copy
  }
}

async function toFormData (sourceOffer) {
  const data = new FormData()
  const offer = { ...sourceOffer } // (shallow) clone

  if (offer.images) {
    const blobs = {}
    for (const idx of Object.keys(offer.images)) {
      const image = offer.images[idx]
      if (image.toBlob) {
        const blob = await image.toBlob(MIME_TYPE)
        if (!blob) throw new Error('failed to make a blob for image')
        blobs[`images.${idx}.image`] = blob
      }
      else if (image._new) {
        throw new Error('new image did not have a toBlob method')
      }
    }
    for (const key of Object.keys(blobs)) {
      data.append(key, blobs[key], `${key}${EXTENSION}`)
    }
    // we need to leave our original images intact, but only send the required properties to the server
    offer.images = offer.images.map(withoutKeys('toBlob', 'imageUrls'))
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

  async accept (offerId) {
    return convert((await axios.post(`/api/offers/${offerId}/accept/`)).data)
  },

  async archive (offerId) {
    return convert((await axios.post(`/api/offers/${offerId}/archive/`)).data)
  },

  async conversation (offerId) {
    return convertConversation((await axios.get(`/api/offers/${offerId}/conversation/`)).data)
  },

}

export function convert (val) {
  return val // nothing to convert!
}
