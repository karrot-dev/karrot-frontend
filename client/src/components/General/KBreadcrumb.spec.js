import KBreadcrumb from './KBreadcrumb'
import MockRouterLink from '>/MockRouterLink'
import { mountWithDefaults } from '>/helpers'

describe('KBreadcrumb', () => {
  beforeEach(() => jest.resetModules())
  it('renders', () => {
    let wrapper = mountWithDefaults(KBreadcrumb, {
      propsData: {
        breadcrumbs: [],
      },
    })
    expect(wrapper.element.className).toBe('wrapper')
  })

  it('renders links if provided with a route', () => {
    let wrapper = mountWithDefaults(KBreadcrumb, {
      propsData: {
        breadcrumbs: [{ name: 'Some Name', route: { name: 'foo', params: { yay: 1 } } }, { name: 'Last Name' }],
      },
    })
    expect(wrapper.text()).toMatch('Some Name')
    expect(wrapper.text()).toMatch('Last Name')
    expect(wrapper.findAll(MockRouterLink).length).toBe(2)
  })

  it('does not render a link for the last item', () => {
    let wrapper = mountWithDefaults(KBreadcrumb, {
      propsData: {
        breadcrumbs: [{ name: 'Some Name', route: { name: 'foo', params: { yay: 1 } } }],
      },
    })
    expect(wrapper.text()).toMatch('Some Name')
    expect(wrapper.contains('router-link')).toBe(false)
  })
})
