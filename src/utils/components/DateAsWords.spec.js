import FakeTimers from '@sinonjs/fake-timers'
import { describe, beforeEach, afterEach, it, vi } from 'vitest'

import { mountWithDefaults } from '>/helpers'

describe('DateAsWords', () => {
  const now = new Date('2017-08-11T12:00:10Z')
  const date = new Date('2017-08-11T12:00:00Z')
  let DateAsWords, clock
  beforeEach(async () => {
    vi.resetModules()
    clock = FakeTimers.install({ now, toFake: ['Date'] })
    DateAsWords = (await import('./DateAsWords.vue')).default
  })
  afterEach(() => {
    clock = clock.uninstall()
  })

  it('renders 1 second ago', async () => {
    const wrapper = await mountWithDefaults(DateAsWords, {
      propsData: { date },
    })
    // text
    expect(wrapper.text()).toContain('less than a minute ago')
    // tooltip
    expect(wrapper.element.title).toBe('Aug 11, 2017, 12:00 PM')
  })
})
