jest.mock('@/store/plugins/persistedState', () => {
  return () => {}
})

import LocaleSelect from './LocaleSelect'
import { locales, localeOptions } from '@/i18n'
import { mountWithDefaults, polyfillRequestAnimationFrame, mockActionOnce } from '>/helpers'

import store from '@/store'

polyfillRequestAnimationFrame()

describe('LocaleSelect', () => {
  it('renders all the available locales', () => {
    const wrapper = mountWithDefaults(LocaleSelect, { store })
    expect(wrapper.findAll('.q-item-label').length).toBe(locales.length)
    for (let locale of locales) {
      expect(wrapper.html()).toContain(locale.name)
    }
  })

  it('can select a locale', () => {
    mockActionOnce(store, 'auth/update')
    const wrapper = mountWithDefaults(LocaleSelect, { store })
    const idx = Math.floor(Math.random() * localeOptions.length) // pick a random locale
    wrapper.findAll('.q-item-label').at(idx).trigger('click')
    expect(store.state.i18n.locale).toBe(localeOptions[idx].value)
  })
})
