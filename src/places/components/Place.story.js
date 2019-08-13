import { storiesOf } from '@storybook/vue'
import { statusMocks, storybookDefaults as defaults, createDatastore } from '>/helpers'

import PlaceList from './PlaceList'
import PlaceEdit from './PlaceEdit'
import PlaceHeader from './PlaceHeader'
import { makePlace, makeGroup, makeUser } from '>/enrichedFactories'

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

const headerDatastore = createDatastore({
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
    render: h => h(PlaceList, {
      props: { places },
    }),
  }))
  .add('PlaceEdit', () => defaults({
    render: h => h(PlaceEdit, {
      props: {
        value: place,
        allPlaces: otherPlaces,
        status: statusMocks.default(),
      },
    }),
  }))
  .add('PlaceEdit (with server error)', () => defaults({
    render: h => h(PlaceEdit, {
      props: {
        value: place,
        allPlaces: otherPlaces,
        status: statusMocks.validationError('name', 'a nice server error'),
      },
    }),
  }))
  .add('PlaceHeader', () => defaults({
    render: h => h(PlaceHeader, { props: { places } }),
    store: headerDatastore,
  }))
