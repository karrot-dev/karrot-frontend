<template>
  <q-btn
    v-back-to-top
    round
    class="fixed-bottom-right bg-primary btt-btn"
  >
    <q-icon
      name="keyboard_arrow_up"
      color = "white"
    />
  </q-btn>
</template>

<script>
import {
  Ripple,
  QBtn,
  QIcon,
  BackToTop,
} from 'quasar'
export default {
  components: {
    QBtn,
    QIcon,
  },
  directives: {
    BackToTop,
    Ripple,
  },
  name: 'BackToTopBtn',
}
</script>

<style scoped lang = "stylus">
  .btt-btn
    margin: 0 15px 80px 0
</style>
