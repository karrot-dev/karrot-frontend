import { Notify } from 'quasar'
import i18n from '@/i18n'

export default store => {
  store.subscribeAction(({ type, payload }, state) => {
    if (type === 'toasts/show') {
      const { message, messageParams, config } = payload
      const defaultConfig = {
        type: 'positive',
        actions: [
          {
            icon: 'close',
            handler: () => {},
          },
        ],
      }

      Notify.create({
        ...defaultConfig,
        ...config,
        message: i18n.t(message, messageParams),
      })
    }
  })
}
