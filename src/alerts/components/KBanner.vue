<!--

  A version of QBanner that cannot remove itself

  We use vuex state for deciding whether a banner should be shown or not.

-->
<script>
import { QBanner } from 'quasar'
export default {
  extends: QBanner,
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
