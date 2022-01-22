import SignupUser from './SignupUser'
import { QCheckbox } from 'quasar'
import { mountWithDefaults, statusMocks } from '>/helpers'

const userData = {
  displayName: 'my name',
  email: 'hello@hello.com',
  password: 'secret',
}

describe('Signup', () => {
  beforeEach(() => jest.resetModules())
  it('submits', () => {
    const wrapper = mountWithDefaults(SignupUser, {
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
