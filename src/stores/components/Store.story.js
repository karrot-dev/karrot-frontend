import { storiesOf } from '@storybook/vue'
import { storesMock as stores } from '>/mockdata'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import StoreList from './StoreList'
import StoreEdit from './StoreEdit'

const store = stores[0]
const otherStores = stores.slice(1)

storiesOf('Stores', module)
  .add('StoreList', () => defaults({
    render: h => h(StoreList, { props: { stores } }),
  }))

  .add('StoreEdit', () => defaults({
    render: h => h(StoreEdit, {
      props: {
        value: store,
        allStores: otherStores,
        status: statusMocks.default(),
      },
    }),
  }))

  .add('StoreEdit (with server error)', () => defaults({
    render: h => h(StoreEdit, {
      props: {
        value: store,
        allStores: otherStores,
        status: statusMocks.validationError('name', 'a nice server error'),
      },
    }),
  }))
