import { h } from 'vue'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupPreviewUI from './GroupPreviewUI'

import { makeGroupInfo } from '>/enrichedFactories'

const on = {
  join: action('join group'),
  withdraw: action('withdraw application'),
  'go-visit': action('visit group'),
  'go-settings': action('visit settings page'),
  'go-signup': action('visit signup page'),
  'go-apply': action('visit apply page'),
}

storiesOf('GroupPreviewUI', module)
  .add('not logged in', () => defaults({
    render: () => h(GroupPreviewUI, {
      props: {
        group: makeGroupInfo({ isOpen: true }),
        isLoggedIn: false,
      },
      on,
    }),
  }))
  .add('not member, application needed, email verified', () => defaults({
    render: () => h(GroupPreviewUI, {
      props: {
        group: makeGroupInfo(),
        user: {
          mailVerified: true,
        },
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('not member, application needed, email not verified', () => defaults({
    render: () => h(GroupPreviewUI, {
      props: {
        group: makeGroupInfo(),
        user: {
          mailVerified: false,
        },
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('not member, pending application', () => defaults({
    render: () => h(GroupPreviewUI, {
      props: {
        group: makeGroupInfo(),
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
    render: () => h(GroupPreviewUI, {
      props: {
        group: makeGroupInfo({ isOpen: true }),
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('not member, playground', () => defaults({
    render: () => h(GroupPreviewUI, {
      props: {
        group: makeGroupInfo({
          isOpen: true,
          isPlayground: true,
        }),
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('member', () => defaults({
    render: () => h(GroupPreviewUI, {
      props: {
        group: makeGroupInfo({ isMember: true }),
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('without public description', () => defaults({
    render: () => h(GroupPreviewUI, {
      props: {
        group: makeGroupInfo({
          publicDescription: '',
          isMember: true,
        }),
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('pending join', () => defaults({
    render: () => h(GroupPreviewUI, {
      props: {
        group: makeGroupInfo({
          joinStatus: statusMocks.pending(),
          isOpen: true,
        }),
        isLoggedIn: true,
      },
      on,
    }),
  }))
  .add('archived', () => defaults({
    render: () => h(GroupPreviewUI, {
      props: {
        group: makeGroupInfo({
          memberCount: 0,
        }),
        isLoggedIn: false,
      },
      on,
    }),
  }))
