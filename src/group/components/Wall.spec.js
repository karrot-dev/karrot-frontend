jest.mock('@/base/datastore/i18nPlugin')

import { currentUserMock } from '>/mockdata'

import { mountWithDefaults, polyfillRequestAnimationFrame } from '>/helpers'

const defaultProps = {
  conversation: {
    messages: [],
    sendStatus: { pending: false },
    fetchStatus: { pending: false, hasValidationErrors: false },
    fetchPastStatus: { pending: false, hasValidationErrors: false },
    canFetchPast: false,
  },
  user: currentUserMock,
  fetchPast: jest.fn(),
  joinedPickups: [],
  availablePickups: [],
  feedbackPossible: [],
  applications: [],
  refresh: jest.fn(),
}

polyfillRequestAnimationFrame()

describe('Wall', () => {
  beforeEach(() => jest.resetModules())
  it('renders', () => {
    const Wall = require('./Wall').default
    let wrapper = mountWithDefaults(Wall, {
      propsData: defaultProps,
    })
    expect(wrapper.element.className).toBe('wrapper')
  })
})
