import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupInfoCard from './GroupInfoCard'
import i18n from '@/i18n'

import { groupsMock } from '>/mockdata'

const methods = {
  join: action('join group'),
  visit: action('visit group'),
}

storiesOf('GroupInfoCard', module)
  .add('is not member', () => ({
    render: h => h(GroupInfoCard, {
      props: {
        group: { ...groupsMock[0], isMember: false },
        status: { error: null, isWaiting: false },
      },
      on: { join: methods.join },
    }),
    i18n,
  }))
  .add('is member', () => ({
    render: h => h(GroupInfoCard, {
      props: {
        group: { ...groupsMock[0], isMember: true },
        status: { error: null, isWaiting: false },
      },
      on: { visit: methods.visit },
    }),
    i18n,
  }))
  .add('without public description', () => ({
    render: h => h(GroupInfoCard, {
      props: {
        group: { ...groupsMock[0], publicDescription: '', isMember: true },
        status: { error: null, isWaiting: false },
      },
      on: { visit: methods.visit },
    }),
    i18n,
  }))
  .add('waiting', () => ({
    render: h => h(GroupInfoCard, {
      props: {
        group: { ...groupsMock[4], isMember: false },
        status: { error: null, isWaiting: true },
      },
      on: { join: methods.join },
    }),
    i18n,
  }))
  .add('error', () => ({
    render: h => h(GroupInfoCard, {
      props: {
        group: { ...groupsMock[4], isMember: false },
        status: { error: 'asdfasdf', isWaiting: false },
      },
      on: { join: methods.join },
    }),
    i18n,
  }))
