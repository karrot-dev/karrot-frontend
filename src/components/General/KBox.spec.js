import { shallow } from 'vue-test-utils'

import KBox from './KBox.vue'

describe('KBox', () => {
  it('renders', () => {
    let { element } = shallow(KBox)
    expect(element.className).toBe('wrapper')
  })
})
