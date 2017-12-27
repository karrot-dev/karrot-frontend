import glob from 'glob'
import lolex from 'lolex'
import { configure, getStorybook } from '@storybook/vue'
import { createRenderer } from 'vue-server-renderer'
import { polyfillRequestAnimationFrame, mountWithDefaults } from '>/helpers'
polyfillRequestAnimationFrame()

// fake Date object MUST be installed before importing stories
const now = new Date('2017-12-24T12:00:00Z')
let clock
clock = lolex.install({ now, toFake: ['Date'] })

afterAll(() => {
  clock.uninstall()
})

function loadStories () {
  const files = glob.sync('**/*.story.js', { absolute: true })
  for (const f of files) {
    require(f)
  }
}

configure(loadStories, module)

const stories = getStorybook()

for (const group of stories) {
  describe('Storyshots', () => {
    describe(group.kind, () => {
      for (const story of group.stories) {
        it(story.name, async () => {
          // get the component from storybook
          const component = story.render()

          // hack: translations don't work if i18n is in component, so delete it
          delete component.i18n

          const wrapper = mountWithDefaults(component, { clone: false }) // cloning throws errors

          // use server side renderer to get renderered html string
          const renderer = createRenderer()
          expect(renderer.renderToString(wrapper.vm)).resolves.toMatchSnapshot()
        })
      }
    })
  })
}
