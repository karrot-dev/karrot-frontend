<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<<<<<<< HEAD


=======
<template>
  <BannersUI
    :banners="$store.getters['banners/all']"
    @reconnect="$store.dispatch('connectivity/reconnect')"
    @dismiss-banner="id => $store.dispatch('communityFeed/dismissBanner', id)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import BannersUI from './BannersUI'

export default {
  components: {
    BannersUI,
  },
}
</script>
