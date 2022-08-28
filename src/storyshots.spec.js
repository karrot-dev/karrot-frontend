
import initStoryshots, { Stories2SnapsConverter } from '@storybook/addon-storyshots'
import lolex from 'lolex'

import i18n from '@/base/i18n'
import '>/routerMocks'

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

// Runner
initStoryshots({
  asyncJest: true, // this is the option that activates the async behaviour
  test: async ({
    story,
    context,
    renderTree,
    done, // --> callback passed to test method when asyncJest option is true
  }) => {
    const converter = new Stories2SnapsConverter()
    // to avoid snapshots in src/src/, strip leading 'src/' in filename
    const snapshotFilename = converter.getSnapshotFileName(context).slice(4)

    const tree = renderTree(story, context)

    // wait until the mount is updated, in our app mostly by Relay
    // but maybe something else updating the state of the component
    // somewhere
    const waitTime = 2000
    setTimeout(async () => {
      if (snapshotFilename) {
        expect(tree).toMatchSpecificSnapshot(snapshotFilename)
      }

      done()
    }, waitTime)
  },
  // other options here
})
