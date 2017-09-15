import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import PickupSeriesEdit from './PickupSeriesEdit.vue'

storiesOf('PickupSeriesEdit', module)
  .add('Default', () => ({
    components: { PickupSeriesEdit },
    template: '<PickupSeriesEdit @submit="handleSubmit" />',
    methods: {
      handleSubmit: action('submit')
    }
  }))
