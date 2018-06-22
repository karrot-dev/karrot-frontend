jest.mock('@/store/plugins/i18n')

import Wall from './Wall'
import { currentUserMock } from '>/mockdata'

import { mountWithDefaults, polyfillRequestAnimationFrame } from '>/helpers'

const defaultProps = {
  conversation: {
    messages: [],
    sendStatus: { pending: false },
    fetchStatus: { pending: false, hasValidationErrors: false },
    fetchMoreStatus: { pending: false, hasValidationErrors: false },
    canLoadMore: false,
  },
  user: currentUserMock,
  fetchMore: jest.fn(),
  joinedPickups: [],
  availablePickups: [],
  feedbackPossible: [],
}

polyfillRequestAnimationFrame()

describe('Wall', () => {
  beforeEach(() => jest.resetModules())
  it('renders', () => {
    let wrapper = mountWithDefaults(Wall, {
      propsData: defaultProps,
    })
    expect(wrapper.element.children[0].className).toBe('wrapper')
  })
})
