import { storiesOf } from '@storybook/vue'
import { storesMock as stores } from '>/mockdata'

import StoreList from './StoreList.vue'
import i18n from '@/i18n'
import router from '@/router'

storiesOf('Stores', module)
  .add('StoreList', () => ({
    render: h => h(StoreList, { props: { stores } }),
    i18n,
    router,
  }))
