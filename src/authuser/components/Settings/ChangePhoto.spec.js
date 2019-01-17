import Vue from 'vue'

import ChangePhoto from './ChangePhoto'
import { usersMock } from '>/mockdata'
import cloneDeep from 'clone-deep'

import { mountWithDefaults, polyfillRequestAnimationFrame, statusMocks } from '>/helpers'

polyfillRequestAnimationFrame()

describe('ChangePhoto', () => {
  beforeEach(() => jest.resetModules())
  let wrapper
  let user

  beforeEach(() => {
    user = cloneDeep(usersMock[0])
    wrapper = mountWithDefaults(ChangePhoto, { propsData: { value: user, status: statusMocks.default() } })
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
    wrapper.setProps({
      value: {
        ...user,
        photoUrls: { fullSize: '/foo.jpg' },
      },
    })
    await Vue.nextTick()
    expect(wrapper.find('img').element.src).toBe('http://localhost:8080/foo.jpg')
  })

  it('emits a save event', async () => {
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual(null)
  })
})
