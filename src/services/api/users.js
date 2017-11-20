import axios from '@/services/axios'

export default {
  async get (id) {
    return (await axios.get(`/api/users/${id}/`)).data
  },

  async list () {
    return (await axios.get('/api/users/')).data
  },

  async search (query) {
    return (await axios.get('/api/users/', { params: { search: query } })).data
  },

  verifyMail (key) {
    return axios.post('/api/users/verify_mail/', { key })
  },

  resetPassword (email) {
    return axios.post('/api/users/reset_password/', { email })
  },

  resendVerificationRequest () {
    return axios.post('/api/users/resend_verification/')
  },
}
