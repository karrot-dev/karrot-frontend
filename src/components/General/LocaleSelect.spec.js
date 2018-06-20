import LocaleSelect from './LocaleSelect'
import locales from '@/locales'
import { localeOptions } from '@/i18n'
import { mountWithDefaults, polyfillRequestAnimationFrame, createStore } from '>/helpers'

polyfillRequestAnimationFrame()

describe('LocaleSelect', () => {
  beforeEach(() => jest.resetModules())
  let store

  const i18n = {
    actions: { setLocale: jest.fn() },
    getters: { locale: jest.fn() },
  }

  beforeEach(() => {
    store = createStore({
      i18n,
    })
  })

  it('renders all the available locales', () => {
    const wrapper = mountWithDefaults(LocaleSelect, { store })
    expect(wrapper.findAll('.q-item-label').length).toBe(Object.keys(locales).length)
    for (let locale of Object.values(locales)) {
      expect(wrapper.html()).toContain(locale.name)
    }
  })

  it('can select a locale', () => {
    const wrapper = mountWithDefaults(LocaleSelect, { store })
    const idx = Math.floor(Math.random() * localeOptions.length) // pick a random locale
    wrapper.findAll('.q-item-label').at(idx).trigger('click')
    expect(i18n.actions.setLocale).toHaveBeenCalled()
    expect(i18n.actions.setLocale.mock.calls[0][1]).toBe(localeOptions[idx].value)
  })
})
