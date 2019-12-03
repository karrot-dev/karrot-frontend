import axios from '@/base/api/axios'

function includeURL (url) {
  return (
    url !== '/api/stats/' &&
    !/mark_user_active/.test(url)
  )
}

export default datastore => {
  axios.interceptors.request.use(request => {
    if (includeURL(request.url)) {
      datastore.dispatch('loadingprogress/start')
    }
    return request
  }, (error) => {
    datastore.dispatch('loadingprogress/stop')
    return Promise.reject(error)
  })

  axios.interceptors.response.use(response => {
    if (includeURL(response.config.url)) {
      datastore.dispatch('loadingprogress/stop')
    }
    return response
  }, (error) => {
    datastore.dispatch('loadingprogress/stop')
    return Promise.reject(error)
  })
}
