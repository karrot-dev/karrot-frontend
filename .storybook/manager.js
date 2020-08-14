import { addons } from '@storybook/addons'
import { create } from '@storybook/theming/create'

const theme = create({
  base: 'light',
  brandTitle: 'Karrot Storybook',
  brandUrl: 'https://github.com/yunity/karrot-frontend',
})

addons.setConfig({
  panelPosition: 'bottom',
  theme,
})
