import axios from '@/services/axios'

export default {
  async create (data) {
    return (await axios.post('/api/auth/user/', data)).data
  },

  async get () {
    return (await axios.get(`/api/auth/user/`)).data
  },

  async save (obj) {
    return (await axios.patch(`/api/auth/user/`, obj)).data
  },

  delete (id) {
    return axios.delete(`/api/auth/user/`)
  },

  verifyMail (key) {
    return axios.post('/api/auth/user/verify_mail/', { key })
  },

  resendVerificationRequest () {
    return axios.post('/api/auth/user/resend_verification/')
  },
}
