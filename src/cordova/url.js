/*

  This is to set the base URL for API requests

      When running in a web browser the API requests will go to the domain that
      served the files. When running in cordova they are served locally over
      file:// protocol which obviously can't serve those requests.

      We have to set a base url for all requests which we do via an interceptor.
*/

import axios from '@/services/axios'

if (CORDOVA_BACKEND) {
  axios.interceptors.request.use(request => {
    request.baseURL = CORDOVA_BACKEND
    return request
  })
}
