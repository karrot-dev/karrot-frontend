jest.mock('@/store/plugins/persistedState', () => {
  return () => {}
})

import Settings from './Settings.vue'
import { locales } from '@/i18n'
import { mountWithDefaults, polyfillRequestAnimationFrame } from '>/helpers'

import store from '@/store'

import { usersMock } from '>/mockdata'

polyfillRequestAnimationFrame()

describe('Settings', () => {
  beforeEach(() => {
    store.commit('auth/Receive Login Status', { user: usersMock[0] })
  })

  it('renders all the available locales', () => {
    let wrapper = mountWithDefaults(Settings, { store })
    expect(wrapper.findAll('.q-item-label').length).toBe(locales.length)
    for (let locale of locales) {
      expect(wrapper.html()).toContain(locale.name)
    }
  })

  it('can select a locale', () => {
    let wrapper = mountWithDefaults(Settings, { store })
    const locales = store.getters['i18n/localeOptions']
    let idx = Math.floor(Math.random() * locales.length) // pick a random locale
    wrapper.findAll('.q-item-label').at(idx).trigger('click')
    expect(store.state.i18n.locale).toBe(locales[idx].value)
  })
})
