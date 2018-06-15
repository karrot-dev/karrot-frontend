<script>
import { LMarker } from 'vue2-leaflet'
export default {
  name: 'ExtendedMarker',
  extends: LMarker,
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
