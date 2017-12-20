import glob from 'glob'
import { configure, getStorybook } from '@storybook/vue'
import { createRenderer } from 'vue-server-renderer'
import { polyfillRequestAnimationFrame, mountWithDefaults } from '>/helpers'
polyfillRequestAnimationFrame()

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
