<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import Vue from 'vue'
=======
import { nextTick } from 'vue'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

import ProfileEdit from './ProfileEdit'
import { usersMock } from '>/mockdata'
import cloneDeep from 'clone-deep'

import { mountWithDefaults, statusMocks } from '>/helpers'

describe('ProfileEdit', () => {
  beforeEach(() => jest.resetModules())
  let wrapper
  let user

  beforeEach(() => {
    user = cloneDeep(usersMock[0])
    wrapper = mountWithDefaults(ProfileEdit, { propsData: { value: user, status: statusMocks.default() } })
  })

  it('renders', () => {
    expect(wrapper.element.className).toBe('edit-box')
  })

  it('can reset to initial state', () => {
    wrapper.vm.edit.displayName = 'a nice new name'
    wrapper.vm.reset()
    expect(wrapper.vm.edit).toEqual(user)
  })

  it('detects if you have changed something', () => {
    expect(wrapper.vm.hasChanged).toBe(false)
    wrapper.vm.edit.displayName = 'a new name'
    expect(wrapper.vm.hasChanged).toBe(true)
    return nextTick().then(() => {
      expect(wrapper.classes()).toContain('changed')
    })
  })

  it('emits a save event with a diff of changes', () => {
    wrapper.vm.edit.displayName = 'my new name'
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual({ id: user.id, displayName: 'my new name' })
  })
})
