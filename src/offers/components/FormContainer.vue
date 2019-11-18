<script>
import { Platform, QCard } from 'quasar'
const Component = Platform.is.mobile ? 'div' : QCard
export default {
  functional: true,
  render (h, context) {
    return h(Component, context.data, context.children)
  },
}
</script>
