import Signup from './Signup'
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
    const wrapper = mountWithDefaults(Signup, {
      propsData: {
        status: statusMocks.default(),
        prefillEmail: () => '',
        hasPlayground: true,
        hasGroupToJoin: false,
      },
    })
    Object.assign(wrapper.vm.user, userData)
    const checkboxes = wrapper.findAll(QCheckbox)
    expect(checkboxes.length).toBe(1)
    expect(wrapper.vm.joinPlayground).toEqual(true)
    wrapper.vm.submit()

    expect(wrapper.emitted().submit).toBeTruthy()
    expect(wrapper.emitted().submit[0][0]).toEqual({
      joinPlayground: true,
      userData,
    })
  })

  it('submits without playground', () => {
    const wrapper = mountWithDefaults(Signup, {
      propsData: {
        status: statusMocks.default(),
        prefillEmail: () => '',
        hasPlayground: false,
        hasGroupToJoin: false,
      },
    })
    Object.assign(wrapper.vm.user, userData)
    const checkboxes = wrapper.findAll(QCheckbox)
    expect(checkboxes.length).toBe(0)
    wrapper.vm.submit()

    expect(wrapper.emitted().submit).toBeTruthy()
    expect(wrapper.emitted().submit[0][0]).toEqual({
      joinPlayground: false,
      userData,
    })
  })

  it('submits with chosen group', () => {
    const wrapper = mountWithDefaults(Signup, {
      propsData: {
        status: statusMocks.default(),
        prefillEmail: () => '',
        hasPlayground: false,
        hasGroupToJoin: true,
      },
    })
    Object.assign(wrapper.vm.user, userData)
    const checkboxes = wrapper.findAll(QCheckbox)
    expect(checkboxes.length).toBe(0)
    wrapper.vm.submit()

    expect(wrapper.emitted().submit).toBeTruthy()
    expect(wrapper.emitted().submit[0][0]).toEqual({
      joinPlayground: false,
      userData,
    })
  })

  it('deselects playground', () => {
    const wrapper = mountWithDefaults(Signup, {
      propsData: {
        status: statusMocks.default(),
        prefillEmail: () => '',
        hasPlayground: true,
        hasGroupToJoin: false,
      },
    })
    Object.assign(wrapper.vm.user, userData)
    const checkboxes = wrapper.findAll(QCheckbox)
    expect(checkboxes.length).toBe(1)
    expect(wrapper.vm.joinPlayground).toEqual(true)
    checkboxes.at(0).trigger('click')
    expect(wrapper.vm.joinPlayground).toEqual(false)
    wrapper.vm.submit()

    expect(wrapper.emitted().submit).toBeTruthy()
    expect(wrapper.emitted().submit[0][0]).toEqual({
      joinPlayground: false,
      userData,
    })
  })
})
