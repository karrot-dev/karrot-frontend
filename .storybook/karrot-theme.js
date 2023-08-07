import { create } from '@storybook/theming/create'

export default create({
  base: isDark() ? 'dark' : 'light',
  brandTitle: 'Karrot Storybook',
  brandUrl: 'https://github.com/karrot-dev/karrot-frontend',
})

function isDark () {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}
