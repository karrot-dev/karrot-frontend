import { QCheckbox } from 'quasar'
import { vi } from 'vitest'

import { mountWithDefaults } from '>/helpers'
import { statusMocks } from '>/statusMocks'

import Signup from './Signup.vue'

const userData = {
  displayName: 'my name',
  username: 'myusername',
  email: 'hello@hello.com',
  password: 'secret',
}

describe('Signup', () => {
  beforeEach(() => { vi.resetModules() })
  it('submits', async () => {
    const wrapper = await mountWithDefaults(Signup, {
      propsData: {
        status: statusMocks.default(),
        prefillEmail: '',
        hasGroupToJoin: false,
      },
    })
    wrapper.vm.user = {
      ...wrapper.vm.user,
      ...userData,
    }

    const checkboxes = wrapper.findAllComponents(QCheckbox)
    expect(checkboxes.length).toBe(0)
    wrapper.vm.submit()

    expect(wrapper.emitted().submit).toBeTruthy()
    expect(wrapper.emitted().submit[0][0]).toEqual({
      userData,
    })
  })
})
