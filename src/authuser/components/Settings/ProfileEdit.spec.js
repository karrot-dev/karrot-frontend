import { flushPromises } from '@vue/test-utils'
import { vi, describe, it, beforeEach } from 'vitest'

import { mountWithDefaults } from '>/helpers'
import '>/routerMocks'
import { createUser, loginAs } from '>/mockBackend'
import { useMockBackend } from '>/mockBackend/setup'
import { statusMocks } from '>/statusMocks'

import ProfileEdit from './ProfileEdit.vue'

describe('ProfileEdit', () => {
  useMockBackend()
  beforeEach(() => { vi.resetModules() })
  let wrapper
  let user

  beforeEach(() => {
    user = createUser()
    loginAs(user)
  })

  beforeEach(async () => {
    wrapper = await mountWithDefaults(ProfileEdit, { propsData: { value: user, status: statusMocks.default() } })
  })

  it('renders', () => {
    expect(wrapper.element.className).toBe('edit-box')
  })

  it('can reset to initial state', () => {
    wrapper.vm.edit.displayName = 'a nice new name'
    wrapper.vm.reset()
    expect(wrapper.vm.edit).toEqual(user)
  })

  it('detects if you have changed something', async () => {
    expect(wrapper.vm.hasChanged).toBe(false)
    wrapper.vm.edit = {
      ...wrapper.vm.edit,
      displayName: 'a new name',
    }
    expect(wrapper.vm.hasChanged).toBe(true)
    await flushPromises()
    expect(wrapper.classes()).toContain('changed')
  })

  it('emits a save event with a diff of changes', () => {
    wrapper.vm.edit.displayName = 'my new name'
    wrapper.vm.save()
    expect(wrapper.emitted().save[0][0]).toEqual({ id: user.id, displayName: 'my new name' })
  })
})
