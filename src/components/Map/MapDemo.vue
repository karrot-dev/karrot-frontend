<template>
  <StandardMap :markers="markers"/>
</template>

<script>
import StandardMap from '@/components/Map/StandardMap'
import L from 'leaflet'

export default {
  components: { StandardMap },
  data () {
    return {
      markers: [
        {
          latLng: L.latLng(47.413220, -1.219482),
          icon: L.AwesomeMarkers.icon({
            icon: 'heart',
            markerColor: 'red',
            prefix: 'fa',
          }),
          popupcontent: '<a href="https://foodsaving.world">go there</a>',
        },
      ],
    }
  },
}
</script>
