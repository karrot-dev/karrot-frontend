<!--

  A version of QAlert that cannot remove itself

  We use vuex state for deciding whether an alert should be shown or not.

-->
<script>
import { QAlert } from 'quasar'
export default {
  extends: QAlert,
  methods: {
    dismiss (fn) {
      this.$emit('dismiss')
      if (typeof fn === 'function') {
        fn()
      }
    },
  },
}
</script>
