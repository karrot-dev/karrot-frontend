// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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
