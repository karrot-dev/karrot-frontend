import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { test } from 'vitest'

import App from '@/App.vue'
import locales from '@/locales/index'
import router from '@/router'

import { withDefaults } from '>/helpers'
import { useMockBackend } from '>/mockBackend'

useMockBackend()

test('change language whilst logged out', async () => {
  const user = userEvent.setup()

  const { findByText, findByTitle } = render(App, await withDefaults({
    global: { plugins: [router], stubs: { RouterLink: false } },
  }))

  await user.click(await findByTitle('Switch language'))

  // try switching to all languages available
  for (const { name, messages: getMessages } of Object.values(locales)) {
    await user.click(await findByText(name))
    const messages = await getMessages()
    await user.click(await findByTitle(messages.LANGUAGECHOOSER.SWITCH))
  }
}, {
  // this test might be a bit slow, let's give it more time
  timeout: 45 * 1000,
})
