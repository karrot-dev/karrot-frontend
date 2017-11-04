jest.mock('@/store/plugins/persistedState', () => {
  return () => {}
})

import DateAsWords from './DateAsWords'
import { mountWithDefaults } from '>/helpers'
import store from '@/store'

describe('DateAsWords', () => {
  it('renders 1 day ago', () => {
    const now = new Date('2017-08-12T12:00:00Z')
    Date.now = jest.genMockFunction().mockReturnValue(now)

    let date = new Date('2017-08-11T10:00:00Z')
    let wrapper = mountWithDefaults(DateAsWords,
      {
        propsData: {
          date,
        },
        store,
      })
    expect(wrapper.text()).toBe('1 day ago')
  })
})
