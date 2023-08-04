import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { makePlace, makeGroup, makeUser } from '>/enrichedFactories'
import { storybookDefaults as defaults, createDatastore } from '>/helpers'
import { statusMocks } from '>/statusMocks'

import PlaceEdit from './PlaceEdit.vue'
import PlaceHeader from './PlaceHeader.vue'
import PlaceList from './PlaceList.vue'

const group = makeGroup()
const place = makePlace({
  isActivePlace: true,
  isSubscribed: true,
  conversationUnreadCount: 5,
  group,
})
const subscribers = [...Array(5).keys()].map(() => makeUser())
const otherPlaces = [...Array(5).keys()].map(() => makePlace({
  group,
}))
const places = [place, ...otherPlaces]

const store = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
  currentGroup: {
    getters: {
      isEditor: () => false,
    },
  },
  places: {
    getters: {
      activePlace: () => place,
      activePlaceId: () => place.id,
      activePlaceSubscribers: () => subscribers,
    },
  },
})

storiesOf('Places', module)
  .add('PlaceList', () => defaults({
    store,
    render: () => h(PlaceList, {
      places,
    }),
  }))
  .add('PlaceEdit', () => defaults({
    store,
    render: () => h(PlaceEdit, {
      value: place,
      allPlaces: otherPlaces,
      status: statusMocks.default(),
    }),
  }))
  .add('PlaceEdit (with server error)', () => defaults({
    store,
    render: () => h(PlaceEdit, {
      value: place,
      allPlaces: otherPlaces,
      status: statusMocks.validationError('name', 'a nice server error'),
    }),
  }))
  .add('PlaceHeader', () => defaults({
    store,
    render: () => h(PlaceHeader, { places }),
  }))
