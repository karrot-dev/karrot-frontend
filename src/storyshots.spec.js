
import initStoryshots from '@storybook/addon-storyshots'
import { render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import lolex from 'lolex'

import i18n from '@/base/i18n'
import { resetServices } from '@/utils/datastore/helpers'

import { withDefaults } from '>/helpers'
import { setupMockBackend, resetMockBackend } from '>/mockBackend'
import '>/routerMocks'

i18n.locale = 'en'

// To get properly faked dates, install fake Date object before importing stories
const now = new Date('2017-12-24T12:00:00Z')
const clock = lolex.install({ now, toFake: ['Date'] })

afterAll(() => {
  clock.uninstall()
})

beforeEach(() => {
  resetMockBackend()
  setupMockBackend()
})

afterEach(() => {
  resetMockBackend()
  jest.resetModules()
  resetServices()
})

// Mock RandomArt because it doesn't play nicely with JSDOM
jest.mock('@/utils/components/RandomArt', () => ({
  template: '<div><slot /></div>',
}))

// Mock locales
jest.mock('@/locales', () => ({
  __esModule: true,
  ...jest.requireActual('@/locales'),
  default: {
    en: {
      name: 'English',
      locale: 'en',
      messages: () => import('@/locales/locale-en.json'),
      dateFnsLocale: () => import('date-fns/locale/en'),
    },
  },
}))

// Mock translation status
jest.mock('@/locales/translationStatus.json', () => ({
  en: '42',
}))

initStoryshots({
  test: async ({
    story,
  }) => {
    const tree = render(story.render(), withDefaults())
    await flushPromises()
    expect(tree.html()).toMatchSnapshot()
  },
})
