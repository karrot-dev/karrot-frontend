import cloneDeep from 'clone-deep'
import { nextTick } from 'vue'

import { createAuthUser } from '@/authuser/api/authUser.mock'
import { camelizeKeys } from '@/utils/utils'

import { mountWithDefaults, statusMocks } from '>/helpers'
import '>/routerMocks'
import { createMockBackend } from '>/mockBackend'

import ProfileEdit from './ProfileEdit'

describe('ProfileEdit', () => {
  beforeEach(() => jest.resetModules())
  let wrapper
  let user

  beforeEach(() => {
    createMockBackend(({ db }) => {
      db.authUser = createAuthUser()
      user = camelizeKeys(db.authUser)
    })
  })

  beforeEach(() => {
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
