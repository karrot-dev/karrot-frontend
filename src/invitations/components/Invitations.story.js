// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT




import { storiesOf } from '@storybook/vue'
import { storybookDefaults as defaults, statusMocks } from '>/helpers'
import * as factories from '>/enrichedFactories'

import InvitationsList from './InvitationsList'
import InvitationsForm from './InvitationsForm'

const range = n => [...Array(n).keys()]

const invitations = range(4).map(() => factories.makeInvitation())

storiesOf('Invitations', module)
  .add('InvitationsList', () => defaults({
    render: h => h(InvitationsList, {
      props: {
        invitations,
        fetchStatus: statusMocks.default(),
        sendStatus: statusMocks.default(),
      },
    }),
  }))
  .add('InvitationsForm', () => defaults({
    render: h => h(InvitationsForm, {
      props: {
        status: statusMocks.default(),
      },
    }),
  }))
