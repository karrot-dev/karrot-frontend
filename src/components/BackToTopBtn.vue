<template>
  <q-btn
    v-back-to-top
    round
    class="fixed-bottom-right"
    style="margin: 0 15px 15px 0; background-color: #4a3520"
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
  QFixedPosition,
  BackToTop,
} from 'quasar'
export default {
  components: {
    QBtn,
    QIcon,
    QFixedPosition,
  },
  directives: {
    BackToTop,
    Ripple,
  },
  name: 'BackToTopBtn',
}
</script>
