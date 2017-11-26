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
  emptyPickups: [],
}

polyfillRequestAnimationFrame()

describe('Wall', () => {
  it('renders', () => {
    let wrapper = mountWithDefaults(Wall, {
      propsData: defaultProps,
    })
    expect(wrapper.element.className).toBe('wrapper')
  })
})
