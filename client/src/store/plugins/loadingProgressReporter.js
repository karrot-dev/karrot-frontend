import axios from '@/services/axios'

export default store => {
  axios.interceptors.request.use(request => {
    store.dispatch('loadingprogress/start')
    return request
  }, (error) => {
    store.dispatch('loadingprogress/stop')
    return Promise.reject(error)
  })

  axios.interceptors.response.use(response => {
    store.dispatch('loadingprogress/stop')
    return response
  }, (error) => {
    store.dispatch('loadingprogress/stop')
    return Promise.reject(error)
  })
}
