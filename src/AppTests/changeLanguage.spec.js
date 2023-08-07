import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { test } from 'vitest'

import App from '@/App.vue'
import i18n from '@/base/i18n'
import locales from '@/locales/index'
import router from '@/router'

import { withDefaults } from '>/helpers'
import { useMockBackend } from '>/mockBackend/setup'

useMockBackend()

test('change language whilst logged out', async () => {
  const user = userEvent.setup()

  const { findByText, findByTitle } = render(App, await withDefaults({
    global: { plugins: [router], stubs: { RouterLink: false } },
  }))

  await user.click(await findByTitle('Switch language'))

  // try switching to all languages available
  for (const { name } of Object.values(locales)) {
    await user.click(await findByText(name))
    await user.click(await findByTitle(i18n.t('LANGUAGECHOOSER.SWITCH')))
  }
})
