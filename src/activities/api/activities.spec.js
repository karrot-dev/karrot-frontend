describe('activities/api/activities', () => {
  beforeEach(() => jest.resetModules())

  it('converts date range into date and dateEnd', () => {
    const { convert } = require('./activities')
    const date = new Date()
    const dateEnd = new Date()
    expect(convert({
      date: [date, dateEnd],
    })).toEqual({ date, dateEnd })
  })

  it('converts date into date range', () => {
    const { convertDateToRange } = require('./activities')
    const date = new Date()
    expect(convertDateToRange({
      date,
    })).toEqual({
      date: [date],
    })
  })
})
