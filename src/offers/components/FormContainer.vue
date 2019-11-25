<script>
import { Platform, QCard } from 'quasar'
const Component = Platform.is.mobile ? 'div' : QCard
export default {
  functional: true,
  render (h, { data, children }) {
    if (data.class) {
      throw new Error('FormContainer component does not support class attribute')
    }
    return h(Component, { ...data, class: ['bg-white', 'q-mb-lg', 'no-shadow', 'grey-border'] }, children)
  },
}
</script>
