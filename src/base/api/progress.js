import { Dialog } from 'quasar'

import { getFormDataSize } from '@/utils/utils'

import UploadProgressDialog from '@/base/components/UploadProgressDialog.vue'

// We only show the progress once the upload goes above a certain size of upload
// Would actually be fancier to do it based on estimated duration
// The progress object seems to have that info, but not sure if it's always available
const SHOW_PROGRESS_IF_UPLOAD_SIZE_EXCEEDS_THIS = 3 * 1000 * 1000

export function configureAxiosProgress (axios) {
  axios.interceptors.request.use(request => {
    // Only care about form data
    if (!(request.data instanceof FormData)) return request

    // Only care if big enough
    const size = getFormDataSize(request.data)
    if (size <= SHOW_PROGRESS_IF_UPLOAD_SIZE_EXCEEDS_THIS) return request

    // Yay, add in a progress dialog!

    const dialog = Dialog.create({
      component: UploadProgressDialog,
      componentProps: {
        progress: null,
      },
    })

    // save it for later so we can
    // close it again after the response comes back
    request.__dialog = dialog

    Object.assign(request, {
      onUploadProgress,
    })

    function onUploadProgress (progress) {
      dialog.update({ progress })
    }

    return request
  })

  axios.interceptors.response.use(response => {
    if (response.config.__dialog) {
      response.config.__dialog.hide()
    }
    return response
  })
}
