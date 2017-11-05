import DateAsWords from './DateAsWords'
import { mountWithDefaults } from '>/helpers'

describe('DateAsWords', () => {
  it('renders 1 day ago', () => {
    const now = new Date('2017-08-12T12:00:00Z')
    Date.now = jest.fn().mockReturnValue(now)

    let date = new Date('2017-08-11T10:00:00Z')
    let wrapper = mountWithDefaults(DateAsWords,
      {
        propsData: {
          date,
        },
      })
    // text
    expect(wrapper.text()).toEqual(expect.stringContaining('1 day ago'))
    // tooltip
    expect(wrapper.text()).toEqual(expect.stringContaining('Aug 11, 2017, 12:00 PM'))
  })
})
