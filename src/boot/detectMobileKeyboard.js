import keyboard from '@/utils/detectMobileKeyboard'

export default ({ app }) => {
  app.config.globalProperties.$keyboard = keyboard
}
