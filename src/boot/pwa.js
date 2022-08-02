import { setPwaInstallPrompt } from '@/base/services'
import { showToast } from '@/utils/toasts'

export default ({ store: datastore }) => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later.
    datastore.commit('pwa/setInstallPrompt', e)
    setPwaInstallPrompt(e)
  })

  window.addEventListener('appinstalled', () => {
    showToast({
      message: 'GLOBAL.APP_INSTALLED',
    })
  })
}
