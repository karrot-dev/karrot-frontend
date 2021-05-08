import TrustButton from './TrustButton'
import { Dialog } from 'quasar'
import { usersMockWithoutCurrent, groupsMock } from '>/mockdata'
import { mountWithDefaults, createDatastore } from '>/helpers'
import { createWrapper } from '@vue/test-utils'

describe('TrustButton', () => {
  let wrapper, datastore

  beforeEach(() => {
    jest.resetModules()
    datastore = createDatastore({
      users: { getters: { get: () => (id) => usersMockWithoutCurrent[3] } },
    })
    wrapper = mountWithDefaults(TrustButton, {
      datastore,
      propsData: {
        user: usersMockWithoutCurrent[0],
        group: groupsMock[0],
        membership: {
          trusted: true,
          trustedBy: [1],
          trustThresholdForNewcomer: 2,
          trustProgress: 1,
          isEditor: true,
          trustUserStatus: {
            pending: false,
          },
          revokeTrustStatus: {
            pending: false,
          },
        },
        small: false,
      },
    })
  })

  it('TrustButton emits revoke-trust', async () => {
    const bodyWrapper = createWrapper(document.body)
    const trustButton = wrapper.findComponent(TrustButton)
    await trustButton.trigger('click')

    const revertTrustButton = bodyWrapper.find('#revokeTrustButton')
    await revertTrustButton.trigger('click')

    // const confirmButton = wrapper.findComponent(QBtn)
    // await confirmButton.trigger('click')

    expect(wrapper.emitted()['revoke-trust']).toBeTruthy()
  })
})
