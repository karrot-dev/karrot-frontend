<template>
  <div class="wrapper">
    <div> Amount Picker </div>
    <img v-for="(photoSrc, idx) in photosArray" :src="appleImg" :key="idx"/>
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
import appleImg from '@/assets/feedback/apple.png'

export default {
  data () {
    return {
      selectedValue: 3.0,
      photosArray: [1, 2],
      appleImg
    }
  },
  components: {
    QSlider
  }
}
</script>

<style scoped lang="stylus">
img
  height: 90px
</style>