<template>
  <div class="wrapper">
    <AmountViewer :amount="selectedValue"/>
    <div>
      <q-slider
        v-model="selectedValue"
        :min="0"
        :max="70"
        :step="0.5"
        label
        snap
      />
    </div>
  </div>
</template>

<script>
import { QSlider } from 'quasar'
import AmountViewer from './AmountViewer.vue'

export default {
  data () {
    return {
      selectedValue: 3.0,
    }
  },
  components: {
    QSlider, AmountViewer,
  },
}
</script>

<style scoped lang="stylus">
</style>
