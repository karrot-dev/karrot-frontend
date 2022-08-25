import { setPwaInstallPrompt } from '@/base/services/pwa'
import { showToast } from '@/utils/toasts'

export default () => {
  window.addEventListener('beforeinstallprompt', event => {
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault()
    // Stash the event so it can be triggered later.
    setPwaInstallPrompt(event)
  })

  window.addEventListener('appinstalled', () => {
    showToast({
      message: 'GLOBAL.APP_INSTALLED',
    })
  })
}
