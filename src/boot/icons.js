import icons from '@/base/icons'

export default ({ app }) => {
  app.config.globalProperties.$icon = icons.get
}
