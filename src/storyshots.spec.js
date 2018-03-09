// Load full build instead of runtime-only to have the compiler available
// jest.mock('vue', () => require('vue/dist/vue.common.js'))

/** Storybook has some unwanted side effects and we actually don't need it to test the stories
 * Therefore, we mimick the Storybook API to get the components and then run the snapshot tests
*/
let mockStories = []
const consoleErrorSpy = jest.spyOn(global.console, 'error')
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
import { polyfillRequestAnimationFrame, mountWithDefaults } from '>/helpers'
polyfillRequestAnimationFrame()

// To get properly faked dates, install fake Date object before importing stories
const now = new Date('2017-12-24T12:00:00Z')
const clock = lolex.install({ now, toFake: ['Date'] })

afterAll(() => {
  clock.uninstall()
})

const files = glob.sync('**/*.story.js', { absolute: true })
for (const f of files) {
  require(f)
}

for (const group of mockStories) {
  describe('Storyshots', () => {
    describe(group.kind, () => {
      for (const story of group.stories) {
        it(story.name, async () => {
          consoleErrorSpy.mockReset()

          // get the component from storybook
          const component = story.render()

          // hack: translations don't work if i18n is in component, so delete it
          delete component.i18n

          const wrapper = mountWithDefaults(component, { clone: false }) // cloning throws errors

          // use server side renderer to get renderered html string
          const renderer = createRenderer()
          expect(renderer.renderToString(wrapper.vm)).resolves.toMatchSnapshot()
          expect(consoleErrorSpy).not.toHaveBeenCalled()
        })
      }
    })
  })
}
