jest.mock('@/store/plugins/persistedState', () => {
  return () => {}
})

import Vue from 'vue'
import Quasar from 'quasar'

import { createLocalVue, mount } from 'vue-test-utils'
import MockRouterLink from '>/MockRouterLink.vue'

import Settings from './Settings.vue'
import i18n, { locales } from '@/i18n'

import store from '@/store'

describe('Settings', () => {
  let localVue

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.component('router-link', MockRouterLink)
    localVue.use(Quasar)
    i18n.locale = 'en'
  })

  it('renders all the available locales', () => {
    let wrapper = mount(Settings, {
      localVue,
    })
    expect(wrapper.findAll('.q-item-label').length).toBe(locales.length)
    for (let locale of locales) {
      expect(wrapper.html()).toContain(locale.name)
    }
  })

  it('can select a locale', () => {
    let wrapper = mount(Settings, {
      localVue,
      store,
    })
    let idx = Math.floor(Math.random() * locales.length) // pick a random locale
    wrapper.findAll('.q-item-label').at(idx).trigger('click')
    expect(store.state.i18n.locale).toBe(locales[idx].locale)
  })
})
