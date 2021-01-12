import { storiesOf } from '@storybook/vue'
import ActivitiesManage from '@/activities/pages/ActivitiesManage'

import { createDatastore, statusMocks, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const range = n => [...Array(n).keys()]

const nonmember = factories.makeUserProfile()
const activitySeries = [factories.makeActivitySeries()]
const place = factories.makePlace()
const activities = range(5).map(() => factories.makeActivity())

const datastore = options => createDatastore({
  activitySeries: {
    getters: {
      byActivePlace: () => activitySeries,
      fetchListForActivePlaceStatus: () => statusMocks.default(),
      createStatus: () => statusMocks.default(),
    },
  },
  activities: {
    getters: {
      byActivePlace: () => activities,
      fetchingForCurrentGroup: () => false,
      createStatus: () => statusMocks.default(),
    },
  },
  activityTypes: {
    getters: {
      activeByCurrentGroup: () => Object.values(factories.activityTypes).map(t => t.status === 'active'),
    },
  },
  places: {
    getters: {
      activePlaceId: () => place.id,
    },
  },
})

storiesOf('ActivitiesManage', module)
  .add('default', () => defaults({
    render: h => h(ActivitiesManage),
    store: datastore({
      activeUser: nonmember,
    }),
  }))
