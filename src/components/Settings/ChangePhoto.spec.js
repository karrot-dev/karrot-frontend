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
    expect(wrapper.element.className).toBe('edit-box')
  })

  it('renders placeholder image', () => {
    expect(wrapper.find('img').element.src).toBe('statics/ic_person_black_24px.svg')
  })

  it('renders image from localhost in development/test', async () => {
    Vue.set(wrapper.vm.value.photoUrls, 'fullSize', '/foo.jpg')
    await Vue.nextTick()
    expect(wrapper.find('img').element.src).toBe('http://localhost:8080/foo.jpg')
  })

  it('emits a save event', async () => {
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual({ photo: null })
  })
})
