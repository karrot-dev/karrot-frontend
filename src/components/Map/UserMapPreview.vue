<template>
  <div
    class="userMapPreview"
    style="position: relative"
  >
    <StandardMap
      :markers="markers"
      :show-attribution="false"
    />
    <router-link
      class="overlay"
      :to="{name: 'map', params: {userId: user.id}}"
    />
  </div>
</template>

<script>
import StandardMap from '@/components/Map/StandardMap'
import L from 'leaflet'

export default {
  components: { StandardMap },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    markers () {
      return [{
        latLng: L.latLng(this.user.latitude, this.user.longitude),
        id: 'user_' + this.user.id,
        icon: L.AwesomeMarkers.icon({
          icon: 'user',
          markerColor: 'green',
          prefix: 'fa',
        }),
        popupcontent: `<a href="/#/user/${this.user.id}">${this.user.displayName}</a>`,
      }]
    },
  },
}
</script>

<style scoped lang="stylus">
.overlay
  position absolute
  top 0
  left 0
  width 100%
  height 100%
</style>

<style lang="stylus">
.userMapPreview .leaflet-top.leaflet-left
  display none
</style>
