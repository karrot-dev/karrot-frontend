/** Storybook has some unwanted side effects and we actually don't need it to test the stories
 * Therefore, we mimick the Storybook API to get the components and then run the snapshot tests
*/

const mockStories = []
jest.mock('@storybook/vue3', () => ({
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
import { renderToString } from 'vue/server-renderer'
import { Quasar } from 'quasar'
import i18n, { i18nPlugin } from '@/base/i18n'
import quasarConfig from '>/quasarConfig'
import { mount, RouterLinkStub } from '@vue/test-utils'
import routerMocks from '>/routerMocks'
import icons from '@/base/icons'

i18n.locale = 'en'

// To get properly faked dates, install fake Date object before importing stories
const now = new Date('2017-12-24T12:00:00Z')
const clock = lolex.install({ now, toFake: ['Date'] })

afterAll(() => {
  clock.uninstall()
})

// Mock RandomArt because it doesn't play nicely with JSDOM
jest.mock('@/utils/components/RandomArt', () => ({
  template: '<div><slot /></div>',
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
  template: '<div>VerificationWarning has been mocked</div>',
}))

const files = glob.sync('**/*.story.js', { absolute: true })
for (const f of files) {
  require(f)
}

for (const group of mockStories) {
  describe('Storyshots', () => {
    describe(group.kind, () => {
      for (const story of group.stories) {
        it(story.name, async () => {
          // get the component from storybook
          const component = story.render()

          const { store } = component

          delete component.store

          const wrapper = mount(component, {
            global: {
              plugins: [
                store,
                i18nPlugin,
                [Quasar, quasarConfig],
              ],
              stubs: {
                RouterLink: RouterLinkStub,
                // Stub Croppa as it doesn't seem to work otherwise...
                Croppa: true,
              },
              directives: {
                measure: {},
              },
              mocks: {
                $icon: icons.get,
                ...routerMocks,
              },
            },
          })

          // use server side renderer to get renderered html string
          const html = await renderToString(wrapper.__app)
          expect(html).toMatchSnapshot()
        })
      }
    })
  })
}
