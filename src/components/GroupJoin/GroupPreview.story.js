import { statusMocks, storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupPreviewUI from './GroupPreviewUI'

import { groupsMock } from '>/mockdata'

const on = {
  join: action('join group'),
  withdraw: action('withdraw application'),
  goVisit: action('visit group'),
  goSettings: action('visit settings page'),
  goSignup: action('visit signup page'),
  goApply: action('visit apply page'),
}

storiesOf('GroupPreviewUI', module)
  .add('not logged in', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: {
          ...groupsMock[0],
          isOpen: true,
        },
        isLoggedIn: false,
      },
      on,
    }),
  }))
  .add('not member, application needed, email verified', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: {
          ...groupsMock[0],
          isOpen: false,
        },
        user: {
          mailVerified: true,
        },
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('not member, application needed, email not verified', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: {
          ...groupsMock[0],
          isOpen: false,
        },
        user: {
          mailVerified: false,
        },
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('not member, pending application', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: {
          ...groupsMock[0],
          isOpen: false,
        },
        user: {
          mailVerified: true,
        },
        isLoggedIn: true,
        application: { id: 1 },
      },
      on,
    }),
  }))
  .add('not member, open group', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: {
          ...groupsMock[0],
          isOpen: true,
        },
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('not member, playground', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: {
          ...groupsMock[0],
          isOpen: true,
          isPlayground: true,
        },
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('member', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: {
          ...groupsMock[0],
          isMember: true,
        },
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('without public description', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: {
          ...groupsMock[0],
          publicDescription: '',
          isMember: true,
        },
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('pending join', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: {
          ...groupsMock[4],
          isMember: false,
          isOpen: true,
          joinStatus: statusMocks.pending(),
        },
        isLoggedIn: true,
      },
      on,
    }),
  }))
