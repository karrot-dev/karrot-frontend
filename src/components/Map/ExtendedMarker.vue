<script>
import { Marker } from 'vue2-leaflet'
export default {
  extends: Marker,
  props: {
    opacity: {
      type: Number,
      default: 1,
    },
  },
  mounted () {
    this.mapObject.setOpacity(this.opacity)
  },
  watch: {
    opacity (val) {
      this.mapObject.setOpacity(val)
    },
  },
}
</script>
