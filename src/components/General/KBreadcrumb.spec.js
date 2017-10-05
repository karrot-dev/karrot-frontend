import { createLocalVue, mount } from 'vue-test-utils'

import KBreadcrumb from './KBreadcrumb.vue'
import MockRouterLink from '>/MockRouterLink.vue'

describe('KBreadcrumb', () => {
  it('renders', () => {
    let wrapper = mount(KBreadcrumb, {
      propsData: {
        breadcrumbs: [],
      },
    })
    expect(wrapper.element.className).toBe('wrapper')
  })

  it('renders links if provided with a route', () => {
    let localVue = createLocalVue()
    localVue.component('router-link', MockRouterLink)
    let wrapper = mount(KBreadcrumb, {
      localVue,
      propsData: {
        breadcrumbs: [{ name: 'Some Name', route: { name: 'foo', params: { yay: 1 } } }, { name: 'Last Name' }],
      },
    })
    expect(wrapper.text()).toMatch('Some Name')
    expect(wrapper.text()).toMatch('Last Name')
    expect(wrapper.findAll(MockRouterLink).length).toBe(1)
  })

  it('does not render a link for the last item', () => {
    let wrapper = mount(KBreadcrumb, {
      propsData: {
        breadcrumbs: [{ name: 'Some Name', route: { name: 'foo', params: { yay: 1 } } }],
      },
    })
    expect(wrapper.text()).toMatch('Some Name')
    expect(wrapper.contains('router-link')).toBe(false)
  })
})
