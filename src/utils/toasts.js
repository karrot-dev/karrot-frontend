import { Notify } from 'quasar'

import i18n from '@/base/i18n'

export function showToast (options) {
  const { message, messageParams, config } = options

  const defaultConfig = {
    icon: 'check_circle',
    color: 'positive',
    actions: [
      {
        icon: 'close',
        color: 'white',
        handler: () => {
        },
      },
    ],
  }

  Notify.create({
    ...defaultConfig,
    ...config,
    message: i18n.t(message, messageParams),
  })
}
