import { vi } from 'vitest'

import { localeOptions } from '@/base/i18n'
import locales from '@/locales'

import { createDatastore, mountWithDefaults } from '>/helpers'

import LocaleSelectInner from './LocaleSelectInner.vue'

describe.skip('LocaleSelect', () => {
  beforeEach(() => { vi.resetModules() })
  let datastore

  const i18n = {
    actions: { setLocale: vi.fn() },
    getters: { locale: vi.fn() },
  }

  beforeEach(() => {
    datastore = createDatastore({
      i18n,
    })
  })

  it('renders all the available locales', async () => {
    const wrapper = await mountWithDefaults(LocaleSelectInner, { datastore })
    expect(wrapper.findAll('.q-item').length - 1).toBe(Object.keys(locales).length)
    for (const locale of Object.values(locales)) {
      expect(wrapper.html()).toContain(locale.name)
    }
  })

  it('can select a locale', async () => {
    const wrapper = await mountWithDefaults(LocaleSelectInner, { datastore })
    const idx = Math.floor(Math.random() * localeOptions.length) // pick a random locale
    wrapper.findAll('.q-item')[idx + 1].trigger('click')
    expect(i18n.actions.setLocale).toHaveBeenCalled()
    expect(i18n.actions.setLocale.mock.calls[0][1]).toBe(localeOptions[idx].value)
  })
})
