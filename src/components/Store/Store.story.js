import { storiesOf } from '@storybook/vue'
import { storesMock as stores } from '../mockdata.js'

import StoreList from './StoreList.vue'
import i18n from '@/i18n'

storiesOf('Stores', module)
  .add('StoreList', () => ({
    render: h => h(StoreList, { props: { stores } }),
    i18n,
  }))
