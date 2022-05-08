<template>
  <BannersUI
    :banners="$store.getters['banners/all']"
    @reconnect="$store.dispatch('connectivity/reconnect')"
  />
</template>

<script>
import BannersUI from './BannersUI'

export default {
  components: {
    BannersUI,
  },
}
</script>
