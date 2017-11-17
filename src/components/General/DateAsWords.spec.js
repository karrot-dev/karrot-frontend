import { mountWithDefaults } from '>/helpers'
import lolex from 'lolex'

describe('DateAsWords', () => {
  const now = new Date('2017-08-11T12:00:10Z')
  const date = new Date('2017-08-11T12:00:00Z')
  let DateAsWords, clock
  beforeEach(() => {
    jest.resetModules()
    clock = lolex.install({ now, toFake: ['Date'] })
    DateAsWords = require('./DateAsWords')
  })
  afterEach(() => {
    clock = clock.uninstall()
  })

  it('renders 1 day ago', () => {
    const wrapper = mountWithDefaults(DateAsWords, {
      propsData: { date },
    })
    // text
    expect(wrapper.text()).toContain('less than a minute ago')
    // tooltip
    expect(wrapper.text()).toContain('Aug 11, 2017')
  })
})
