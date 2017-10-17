import Vue from 'vue'
import { createLocalVue, mount } from 'vue-test-utils'

import ProfileEdit from './ProfileEdit.vue'
import { usersMock } from './mockdata'
import i18n from '@/i18n'
import cloneDeep from 'clone-deep'

import Quasar from 'quasar'

import { makeFindAllIterable, polyfillRequestAnimationFrame } from '>/helpers'

polyfillRequestAnimationFrame()

describe('ProfileEdit', () => {
  let localVue
  let wrapper
  let user

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Quasar)
    i18n.locale = 'en'
    user = cloneDeep(usersMock[0])
    wrapper = mount(ProfileEdit, {
      localVue,
      i18n,
      propsData: {
        user,
      },
    })
    makeFindAllIterable(wrapper)
  })

  it('renders', () => {
    expect(wrapper.element.className).toBe('edit')
  })

  it('can reset to initial state', () => {
    wrapper.vm.userEdit.displayName = 'a nice new name'
    wrapper.vm.reset()
    expect(wrapper.vm.userEdit).toEqual(user)
  })

  it('detects if you have changed something', () => {
    expect(wrapper.vm.hasChanged).toBe(false)
    wrapper.vm.userEdit.displayName = 'a new name'
    expect(wrapper.vm.hasChanged).toBe(true)
    return Vue.nextTick(() => {
      expect(wrapper.hasClass('changed')).toBe(true)
    })
  })

  it('emits a save event with a diff of changes', () => {
    wrapper.vm.userEdit.displayName = 'my new name'
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual({ id: user.id, displayName: 'my new name' })
  })
})
