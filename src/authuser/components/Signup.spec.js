// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import Signup from './Signup'
import { QCheckbox } from 'quasar'
import { mountWithDefaults, statusMocks } from '>/helpers'

const userData = {
  displayName: 'my name',
  username: 'myusername',
  email: 'hello@hello.com',
  password: 'secret',
}

describe('Signup', () => {
  beforeEach(() => jest.resetModules())
  it('submits', () => {
    const wrapper = mountWithDefaults(Signup, {
      propsData: {
        status: statusMocks.default(),
        prefillEmail: () => '',
        hasGroupToJoin: false,
      },
    })
    Object.assign(wrapper.vm.user, userData)
    const checkboxes = wrapper.findAllComponents(QCheckbox)
    expect(checkboxes.length).toBe(0)
    wrapper.vm.submit()

    expect(wrapper.emitted().submit).toBeTruthy()
    expect(wrapper.emitted().submit[0][0]).toEqual({
      userData,
    })
  })
})
