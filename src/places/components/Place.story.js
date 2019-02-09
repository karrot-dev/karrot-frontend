import { storiesOf } from '@storybook/vue'
import { placesMock as places } from '>/mockdata'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import PlaceList from './PlaceList'
import PlaceEdit from './PlaceEdit'

const place = places[0]
const otherPlaces = places.slice(1)

storiesOf('Places', module)
  .add('PlaceList', () => defaults({
    render: h => h(PlaceList, { props: { places } }),
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
