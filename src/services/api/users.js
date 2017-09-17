import axios from '@/services/axios'

export default {
  async create (data) {
    return (await axios.post('/api/users/', data)).data
  },

  async get (id) {
    return (await axios.get(`/api/users/${id}/`)).data
  },

  async list () {
    return (await axios.get('/api/users/')).data
  },

  async search (query) {
    return (await axios.get('/api/users/', { params: { search: query } })).data
  },

  async save (obj) {
    return (await axios.patch(`/api/users/${obj.id}/`, obj)).data
  },

  delete (id) {
    return axios.delete(`/api/users/${id}/`)
  },

  verifyMail (key) {
    return axios.post('/api/users/verify_mail/', { key })
  },

  resetPassword (email) {
    return axios.post('/api/users/reset_password', { email })
  },

  resendVerificationRequest () {
    return axios.post('/api/users/resend_verification/')
  },
}
