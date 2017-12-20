import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupPreviewUI from './GroupPreviewUI'

import { groupsMock } from '>/mockdata'

const methods = {
  join: action('join group'),
  visit: action('visit group'),
}

storiesOf('GroupPreviewUI', module)
  .add('is not member', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: { ...groupsMock[0], isMember: false },
        isLoggedIn: true,
      },
      on: { join: methods.join },
    }),
  }))
  .add('is member', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: { ...groupsMock[0], isMember: true },
        isLoggedIn: true,
      },
      on: { visit: methods.visit },
    }),
  }))
  .add('without public description', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: { ...groupsMock[0], publicDescription: '', isMember: true },
        isLoggedIn: true,
      },
      on: { visit: methods.visit },
    }),
  }))
  .add('pending', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: { ...groupsMock[4], isMember: false },
        isLoggedIn: true,
      },
      on: { join: methods.join },
    }),
  }))
  .add('error', () => defaults({
    render: h => h(GroupPreviewUI, {
      props: {
        group: { ...groupsMock[4], isMember: false },
        isLoggedIn: true,
      },
      on: { join: methods.join },
    }),
  }))
