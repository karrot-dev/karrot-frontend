import { vi } from 'vitest'

describe('activities/api/activities', () => {
  beforeEach(() => vi.resetModules())

  it('converts date range into date and dateEnd', async () => {
    const { convert } = await import('./activities')
    const date = new Date()
    const dateEnd = new Date()
    expect(convert({
      date: [date, dateEnd],
    })).toEqual({ date, dateEnd })
  })

  it('converts date into date range', async () => {
    const { convertDateToRange } = await import('./activities')
    const date = new Date()
    expect(convertDateToRange({
      date,
    })).toEqual({
      date: [date],
    })
  })
})
