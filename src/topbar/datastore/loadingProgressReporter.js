import axios from '@/base/api/axios'

export default datastore => {
  axios.interceptors.request.use(request => {
    datastore.dispatch('loadingprogress/start')
    return request
  }, (error) => {
    datastore.dispatch('loadingprogress/stop')
    return Promise.reject(error)
  })

  axios.interceptors.response.use(response => {
    datastore.dispatch('loadingprogress/stop')
    return response
  }, (error) => {
    datastore.dispatch('loadingprogress/stop')
    return Promise.reject(error)
  })
}
