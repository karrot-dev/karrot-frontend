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
  watch: {
    opacity (val) {
      this.mapObject.setOpacity(val)
    },
  },
  mounted () {
    this.mapObject.setOpacity(this.opacity)
  },
}
</script>
