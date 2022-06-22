<template>
  <BannersUI
    :banners="$store.getters['banners/all']"
    @reconnect="$store.dispatch('connectivity/reconnect')"
    @dismiss-banner="id => $store.dispatch('communityFeed/dismissBanner', id)"
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
