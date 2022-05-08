import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
import { storybookDefaults as defaults, statusMocks } from '>/helpers'
import * as factories from '>/enrichedFactories'

import InvitationsList from './InvitationsList'
import InvitationsForm from './InvitationsForm'

const range = n => [...Array(n).keys()]

const invitations = range(4).map(() => factories.makeInvitation())

storiesOf('Invitations', module)
  .add('InvitationsList', () => defaults({
    render: () => h(InvitationsList, {
      invitations,
      fetchStatus: statusMocks.default(),
      sendStatus: statusMocks.default(),
    }),
  }))
  .add('InvitationsForm', () => defaults({
    render: () => h(InvitationsForm, {
      status: statusMocks.default(),
    }),
  }))
