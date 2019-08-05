import { storiesOf } from '@storybook/vue'
import PickupsManage from '@/pickups/pages/PickupsManage'

import { createDatastore, statusMocks, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const range = n => [...Array(n).keys()]

const nonmember = factories.makeUserProfile()
const pickupSeries = [factories.makePickupSeries()]
const place = factories.makePlace()
const pickups = range(5).map(() => factories.makePickup())

const datastore = options => createDatastore({
  pickupSeries: {
    getters: {
      byActivePlace: () => pickupSeries,
      fetchListForActivePlaceStatus: () => statusMocks.default(),
      createStatus: () => statusMocks.default(),
    },
  },
  pickups: {
    getters: {
      byActivePlace: () => pickups,
      fetchingForCurrentGroup: () => false,
      createStatus: () => statusMocks.default(),
    },
  },
  places: {
    getters: {
      activePlaceId: () => place.id,
    },
  },
})

storiesOf('PickupsManage', module)
  .add('default', () => defaults({
    render: h => h(PickupsManage),
    store: datastore({
      activeUser: nonmember,
    }),
  }))
