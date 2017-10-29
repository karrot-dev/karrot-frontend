import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupItem from './PickupItem'
import i18n from '@/i18n'
import { createStore } from '>/helpers'
import { currentUserMock } from '>/mockdata'

const store = createStore({
  auth: {
    getters: {
      user: () => currentUserMock,
    },
  },
})

const methods = {
  join: action('join'),
  leave: action('leave'),
}

storiesOf('PickupItem', module)
  .add('Join', () => ({
    components: { PickupItem },
    template: '<PickupItem @join="join" :pickup="pickup"></PickupItem>',
    data () {
      return {
        pickup: {
          date: new Date(),
          description: 'This is the description',
          isFull: false,
          isUserMember: false,
        },
      }
    },
    methods,
    i18n,
    store,
  }))
  .add('Waiting', () => ({
    components: { PickupItem },
    template: '<PickupItem @join="join" :pickup="pickup"></PickupItem>',
    data () {
      return {
        pickup: {
          date: new Date(),
          description: 'This is the description',
          isFull: false,
          isUserMember: false,
          isWaiting: true,
        },
      }
    },
    methods,
    i18n,
    store,
  }))
  .add('Full', () => ({
    components: { PickupItem },
    template: '<PickupItem :pickup="pickup"></PickupItem>',
    data () {
      return {
        pickup: {
          date: new Date(),
          description: '',
          isFull: true,
          isUserMember: false,
        },
      }
    },
    i18n,
    store,
  }))
  .add('Leave', () => ({
    components: { PickupItem },
    template: '<PickupItem @leave="leave" :pickup="pickup"></PickupItem>',
    data () {
      return {
        pickup: {
          date: new Date(),
          description: '',
          isFull: false,
          isUserMember: true,
        },
      }
    },
    methods,
    i18n,
    store,
  }))
