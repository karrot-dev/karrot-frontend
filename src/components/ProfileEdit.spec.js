import Vue from 'vue'

import ProfileEdit from './ProfileEdit.vue'
import { usersMock } from '>/mockdata'
import cloneDeep from 'clone-deep'

import { mountWithDefaults, polyfillRequestAnimationFrame } from '>/helpers'

polyfillRequestAnimationFrame()

describe('ProfileEdit', () => {
  let wrapper
  let user

  beforeEach(() => {
    user = cloneDeep(usersMock[0])
    wrapper = mountWithDefaults(ProfileEdit, { propsData: { user } })
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
