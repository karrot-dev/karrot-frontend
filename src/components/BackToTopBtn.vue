<template>
  <q-btn
    v-back-to-top
    round
    dense
    class="fixed-bottom-right bg-primary q-mb-md q-mr-sm z-max"
  >
    <q-icon
      name="keyboard_arrow_up"
      color = "white"
    />
  </q-btn>
</template>

<script>
import {
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
  },
}
</script>
