import { storiesOf } from '@storybook/vue'
import { storesMock as stores } from '>/mockdata'
import { statusMocks } from '>/helpers'

import StoreList from './StoreList'
import StoreEdit from './StoreEdit'
import i18n from '@/i18n'
import router from '@/router'

const store = stores[0]
const otherStores = stores.slice(1)

storiesOf('Stores', module)
  .add('StoreList', () => ({
    render: h => h(StoreList, { props: { stores } }),
    i18n,
    router,
  }))

  .add('StoreEdit', () => ({
    render: h => h(StoreEdit, {
      props: {
        value: store,
        allStores: otherStores,
        status: statusMocks.default(),
      },
    }),
    i18n,
    router,
  }))

  .add('StoreEdit (with server error)', () => ({
    render: h => h(StoreEdit, {
      props: {
        value: store,
        allStores: otherStores,
        status: statusMocks.validationError('name', 'a nice server error'),
      },
    }),
    i18n,
    router,
  }))
