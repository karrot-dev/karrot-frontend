import FakeTimers from '@sinonjs/fake-timers'
import { flushPromises } from '@vue/test-utils'
import { vi } from 'vitest'

import { sleep } from '>/helpers'

describe('dateFnsHelper', () => {
  const now = new Date('2017-08-12T12:00:00Z')
  const date = new Date('2017-08-11T10:00:00Z')
  let dateFnsHelper, clock
  beforeEach(async () => {
    vi.resetModules()
    clock = FakeTimers.install({ now, toFake: ['Date'] })
    dateFnsHelper = (await import('./dateFnsHelper')).default
  })
  afterEach(() => {
    clock = clock.uninstall()
  })

  it('renders 1 day ago', () => {
    expect(dateFnsHelper.formatDistanceToNow(date, { addSuffix: true })).toBe('1 day ago')
  })

  it('handles other locales', async () => {
    dateFnsHelper.setLocale('de')
    await flushPromises()
    expect(dateFnsHelper.formatDistanceToNow(date, { addSuffix: true })).toBe('vor 1 Tag')
  })
})
