import { mount } from '@vue/test-utils'

describe('foo', () => {
  it('does something', () => {
    // const app = require('../../.quasar/app')
    const App = require('@/App')
    const wrapper = mount(App)
    expect(wrapper).not.toBeNull()
  })
})
