import LocaleSelectInner from './LocaleSelectInner'
import locales from '@/locales'
import { localeOptions } from '@/base/i18n'
import { mountWithDefaults, createDatastore } from '>/helpers'

describe('LocaleSelect', () => {
  beforeEach(() => jest.resetModules())
  let datastore

  const i18n = {
    actions: { setLocale: jest.fn() },
    getters: { locale: jest.fn() },
  }

  beforeEach(() => {
    datastore = createDatastore({
      i18n,
    })
  })

  it('renders all the available locales', () => {
    const wrapper = mountWithDefaults(LocaleSelectInner, { datastore })
    expect(wrapper.findAll('.q-item').length - 1).toBe(Object.keys(locales).length)
    for (const locale of Object.values(locales)) {
      expect(wrapper.html()).toContain(locale.name)
    }
  })

  it('can select a locale', () => {
    const wrapper = mountWithDefaults(LocaleSelectInner, { datastore })
    const idx = Math.floor(Math.random() * localeOptions.length) // pick a random locale
    wrapper.findAll('.q-item').at(idx + 1).trigger('click')
    expect(i18n.actions.setLocale).toHaveBeenCalled()
    expect(i18n.actions.setLocale.mock.calls[0][1]).toBe(localeOptions[idx].value)
  })
})
