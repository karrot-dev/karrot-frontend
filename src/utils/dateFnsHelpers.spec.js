import FakeTimers from '@sinonjs/fake-timers'

import { sleep } from '>/helpers'

describe('dateFnsHelper', () => {
  const now = new Date('2017-08-12T12:00:00Z')
  const date = new Date('2017-08-11T10:00:00Z')
  let dateFnsHelper, clock
  beforeEach(() => {
    jest.resetModules()
    clock = FakeTimers.install({ now, toFake: ['Date'] })
    dateFnsHelper = require('./dateFnsHelper').default
  })
  afterEach(() => {
    clock = clock.uninstall()
  })

  it('renders 1 day ago', () => {
    expect(dateFnsHelper.formatDistanceToNow(date, { addSuffix: true })).toEqual('1 day ago')
  })

  it('handles other locales', async () => {
    dateFnsHelper.setLocale('de')
    await sleep(50) // needs a bit of time to load it
    expect(dateFnsHelper.formatDistanceToNow(date, { addSuffix: true })).toEqual('vor 1 Tag')
  })
})
