jest.mock('@/store/plugins/persistedState', () => {
  return () => {}
})

import Quasar from 'quasar'

import { createLocalVue, mount } from 'vue-test-utils'
import MockRouterLink from '>/MockRouterLink.vue'

import Settings from './Settings.vue'
import i18n, { locales } from '@/i18n'
import { polyfillRequestAnimationFrame } from '>/helpers'

import store from '@/store'

import { usersMock } from '../components/mockdata'

polyfillRequestAnimationFrame()

describe('Settings', () => {
  let localVue

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.component('router-link', MockRouterLink)
    localVue.use(Quasar)
    i18n.locale = 'en'
    store.commit('auth/Receive Login Status', { user: usersMock[0] })
  })

  it('renders all the available locales', () => {
    let wrapper = mount(Settings, {
      i18n,
      localVue,
      store,
    })
    expect(wrapper.findAll('.q-item-label').length).toBe(locales.length)
    for (let locale of locales) {
      expect(wrapper.html()).toContain(locale.name)
    }
  })

  it('can select a locale', () => {
    let wrapper = mount(Settings, {
      i18n,
      localVue,
      store,
    })
    let idx = Math.floor(Math.random() * locales.length) // pick a random locale
    wrapper.findAll('.q-item-label').at(idx).trigger('click')
    expect(store.state.i18n.locale).toBe(locales[idx].locale)
  })
})
