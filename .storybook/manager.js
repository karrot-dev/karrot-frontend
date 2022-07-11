// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { addons } from '@storybook/addons'
import { create } from '@storybook/theming/create'

const theme = create({
  base: 'light',
  brandTitle: 'Karrot Storybook',
  brandUrl: 'https://github.com/karrot-dev/karrot-frontend',
})

addons.setConfig({
  panelPosition: 'bottom',
  theme,
})
