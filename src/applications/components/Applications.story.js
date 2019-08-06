import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults, statusMocks } from '>/helpers'
import * as factories from '>/enrichedFactories'
import subDays from 'date-fns/sub_days'

import ApplicationFormUI from './ApplicationFormUI'
import ApplicationList from './ApplicationList'

const range = n => [...Array(n).keys()]

const group = factories.makeGroup()
const pending = range(3).map(() => factories.makeApplication())
const otherApplications = range(9).map(i => factories.makeApplication({
  status: ['accepted', 'declined', 'withdrawn'][i % 3],
  isPending: false,
  canDecide: false,
  createdAt: subDays(new Date(), 3),
  decidedBy: factories.makeUser(),
  decidedAt: subDays(new Date(), 1),
}))

storiesOf('Applications', module)
  .add('ApplicationForm', () => defaults({
    render: h => h(ApplicationFormUI, {
      props: {
        group,
      },
    }),
  }))
  .add('ApplicationList', () => defaults({
    render: h => h(ApplicationList, {
      props: {
        pending,
        otherApplications,
        canFetchPast: false,
        fetchPastStatus: statusMocks.default(),
        fetchPast: () => {},
      },
    }),
  }))
