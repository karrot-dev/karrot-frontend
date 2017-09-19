import { mount } from 'vue-test-utils'

import KBreadcrumb from './KBreadcrumb.vue'

describe('KBreadcrumb', () => {
  it('renders', () => {
    let { element } = mount(KBreadcrumb, {
      propsData: {
        breadcrumbs: [],
      },
    })
    expect(element.className).toBe('wrapper')
  })
})
