import { Notify } from 'quasar'
import i18n from '@/i18n'

export default {
  namespaced: true,
  actions: {
    show (_, { message, messageParams, detailMessage, config }) {
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
        detail: i18n.t(detailMessage),
      })
    },
  },
}
