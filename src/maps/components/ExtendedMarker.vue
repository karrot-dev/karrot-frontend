<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


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
