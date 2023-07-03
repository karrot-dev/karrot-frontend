import cloneDeep from 'clone-deep'
import { vi } from 'vitest'

import { mountWithDefaults, statusMocks, nextTicks } from '>/helpers'
import { usersMock } from '>/mockdata'

import ChangePhoto from './ChangePhoto.vue'

// TODO: I've removed @vue/compat stuff, and so a bunch of stuff will need to change... no more vue-croppa...

describe.skip('ChangePhoto', () => {
  beforeEach(() => { vi.resetModules() })
  let wrapper
  let user

  beforeEach(async () => {
    user = cloneDeep(usersMock[0])
    wrapper = await mountWithDefaults(ChangePhoto, { propsData: { value: user, status: statusMocks.default() } })
  })

  it('renders', () => {
    expect(wrapper.element.className).toBe('edit-box k-change-photo')
  })

  it('renders placeholder image', () => {
    // src contains the full path
    // location is set to 'localhost' by jest, but can be configured
    // https://jestjs.io/docs/en/configuration.html#testurl-string
    expect(wrapper.find('img').element.src).toBe('http://localhost/statics/add_a_photo.svg')
  })

  it('renders image from localhost in development/test', async () => {
    await wrapper.setProps({
      value: {
        ...user,
        photoUrls: { fullSize: 'https://karrot.world/media/foo.jpg' },
      },
    })
    await nextTicks(1)
    expect(wrapper.vm.photo).toBe(`${location.protocol}//${location.host}/media/foo.jpg`)
  })

  it('emits a save event', async () => {
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual(null)
  })
})
