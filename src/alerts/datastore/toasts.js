import { Notify } from 'quasar'
import i18n from '@/base/i18n'

export default {
  namespaced: true,
  actions: {
    show (_, { message, messageParams, config }) {
      const defaultConfig = {
        icon: 'check_circle',
        color: 'positive',
        actions: [
          {
            icon: 'close',
            color: 'white',
            handler: () => {},
          },
        ],
      }

      Notify.create({
        ...defaultConfig,
        ...config,
        message: i18n.t(message, messageParams),
      })
    },
  },
}
