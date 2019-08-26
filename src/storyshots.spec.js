/** Storybook has some unwanted side effects and we actually don't need it to test the stories
 * Therefore, we mimick the Storybook API to get the components and then run the snapshot tests
*/
const mockStories = []
jest.mock('@storybook/vue', () => ({
  storiesOf: (kind) => {
    const api = { kind }
    const kindStories = { kind, stories: [] }
    mockStories.push(kindStories)
    api.add = (storyName, getStory) => {
      kindStories.stories.push({
        name: storyName,
        render: getStory,
      })
      return api
    }
    return api
  },
}))

import glob from 'glob'
import lolex from 'lolex'
import { createRenderer } from 'vue-server-renderer'
import Vue from 'vue'
import configureQuasar from '@/base/configureQuasar'
import { mount, RouterLinkStub, TransitionStub, TransitionGroupStub } from '@vue/test-utils'
import i18n from '@/base/i18n'
import routerMocks from '>/routerMocks'

i18n.locale = 'en'
configureQuasar(Vue)
Vue.component('RouterLink', RouterLinkStub)
Vue.component('Transition', TransitionStub)
Vue.component('TransitionGroup', TransitionGroupStub)

// To get properly faked dates, install fake Date object before importing stories
const now = new Date('2017-12-24T12:00:00Z')
const clock = lolex.install({ now, toFake: ['Date'] })

afterAll(() => {
  clock.uninstall()
})

// Mock RandomArt because it doesn't play nicely with JSDOM
jest.mock('@/utils/components/RandomArt', () => ({
  functional: true,
  render: (h, context) => h('div', context.data, context.children),
}))

// Mock locales
jest.mock('@/locales', () => ({
  de: {
    name: 'Deutsch',
    locale: 'de',
    messages: () => import('@/locales/locale-de.json'),
    dateFnsLocale: () => import('date-fns/locale/de'),
  },

  en: {
    name: 'English',
    locale: 'en',
    messages: () => import('@/locales/locale-en.json'),
    dateFnsLocale: () => import('date-fns/locale/en'),
  },
}))

// Mock translation status
jest.mock('@/locales/translationStatus.json', () => ({
  de: '13',
  en: '42',
}))

// Mock annoying components (e.g. too much vuex dependency)
jest.mock('@/authuser/components/Settings/VerificationWarning', () => ({
  render: h => h('div', 'VerificationWarning has been mocked'),
}))

const files = glob.sync('**/*.story.js', { absolute: true })
for (const f of files) {
  require(f)
}

// use server side renderer to get renderered html string
const renderer = createRenderer()

for (const group of mockStories) {
  describe('Storyshots', () => {
    describe(group.kind, () => {
      for (const story of group.stories) {
        it(story.name, async () => {
          // get the component from storybook
          const component = story.render()

          const wrapper = mount(component, {
            mocks: {
              ...routerMocks,
            },
          })
          const html = await renderer.renderToString(wrapper.vm)
          expect(html).toMatchSnapshot()
        })
      }
    })
  })
}
