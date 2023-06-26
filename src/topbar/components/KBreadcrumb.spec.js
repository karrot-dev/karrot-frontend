import { RouterLinkStub } from '@vue/test-utils'
import { vi } from 'vitest'

import { mountWithDefaults } from '>/helpers'

import KBreadcrumb from './KBreadcrumb.vue'
import '>/routerMocks' // sets up the mock router

describe.skip('KBreadcrumb', () => {
  beforeEach(() => vi.resetModules())
  it('renders', async () => {
    const wrapper = await mountWithDefaults(KBreadcrumb, {
      propsData: {
        breadcrumbs: [],
      },
    })
    expect(wrapper.element.className).toBe('wrapper')
  })

  it('renders links if provided with a route', async () => {
    const wrapper = await mountWithDefaults(KBreadcrumb, {
      propsData: {
        breadcrumbs: [{ name: 'Some Name', route: { name: 'foo', params: { yay: 1 } } }, { name: 'Last Name' }],
      },
    })
    expect(wrapper.text()).toMatch('Some Name')
    expect(wrapper.text()).toMatch('Last Name')
    expect(wrapper.findAllComponents(RouterLinkStub).length).toBe(2)
  })

  it('does not render a link for the last item', async () => {
    const wrapper = await mountWithDefaults(KBreadcrumb, {
      propsData: {
        breadcrumbs: [{ name: 'Some Name', route: { name: 'foo', params: { yay: 1 } } }],
      },
    })
    expect(wrapper.text()).toMatch('Some Name')
    expect(wrapper.findAllComponents({ name: 'router-link' }).length).toBe(0)
  })
})
