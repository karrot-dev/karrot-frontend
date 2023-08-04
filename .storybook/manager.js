import { addons } from '@storybook/manager-api'

import karrotTheme from './karrot-theme'

addons.setConfig({
  panelPosition: 'bottom',
  theme: karrotTheme,
})
