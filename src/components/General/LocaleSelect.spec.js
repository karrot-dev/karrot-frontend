jest.mock('@/store/plugins/persistedState', () => {
  return () => {}
})

import LocaleSelect from './LocaleSelect'
import { locales } from '@/i18n'
import { mountWithDefaults, polyfillRequestAnimationFrame, mockActionOnce } from '>/helpers'

import store from '@/store'

polyfillRequestAnimationFrame()

describe('LocaleSelect', () => {
  it('renders all the available locales', () => {
    let wrapper = mountWithDefaults(LocaleSelect, { store })
    expect(wrapper.findAll('.q-item-label').length).toBe(locales.length)
    for (let locale of locales) {
      expect(wrapper.html()).toContain(locale.name)
    }
  })

  it('can select a locale', () => {
    mockActionOnce(store, 'auth/update')
    let wrapper = mountWithDefaults(LocaleSelect, { store })
    const locales = store.getters['i18n/localeOptions']
    let idx = Math.floor(Math.random() * locales.length) // pick a random locale
    wrapper.findAll('.q-item-label').at(idx).trigger('click')
    expect(store.state.i18n.locale).toBe(locales[idx].value)
  })
})
