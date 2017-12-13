import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupPreviewUI from './GroupPreviewUI'
import i18n from '@/i18n'

import { groupsMock } from '>/mockdata'

const methods = {
  join: action('join group'),
  visit: action('visit group'),
}

storiesOf('GroupPreviewUI', module)
  .add('is not member', () => ({
    render: h => h(GroupPreviewUI, {
      props: {
        group: { ...groupsMock[0], isMember: false },
        isLoggedIn: true,
      },
      on: { join: methods.join },
    }),
    i18n,
  }))
  .add('is member', () => ({
    render: h => h(GroupPreviewUI, {
      props: {
        group: { ...groupsMock[0], isMember: true },
        isLoggedIn: true,
      },
      on: { visit: methods.visit },
    }),
    i18n,
  }))
  .add('without public description', () => ({
    render: h => h(GroupPreviewUI, {
      props: {
        group: { ...groupsMock[0], publicDescription: '', isMember: true },
        isLoggedIn: true,
      },
      on: { visit: methods.visit },
    }),
    i18n,
  }))
  .add('pending', () => ({
    render: h => h(GroupPreviewUI, {
      props: {
        group: { ...groupsMock[4], isMember: false },
        isLoggedIn: true,
      },
      on: { join: methods.join },
    }),
    i18n,
  }))
  .add('error', () => ({
    render: h => h(GroupPreviewUI, {
      props: {
        group: { ...groupsMock[4], isMember: false },
        isLoggedIn: true,
      },
      on: { join: methods.join },
    }),
    i18n,
  }))
