<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<template>
  <QLinearProgress
    v-if="loading || closing"
    indeterminate
    color="info"
    class="fixed-top"
    style=" z-index: 2500;height: 2px"
  />
</template>

<script>
import { QLinearProgress } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: { QLinearProgress },
  computed: {
    ...mapGetters({
      loading: 'loadingprogress/active',
      closing: 'loadingprogress/closing',
    }),
  },
}
</script>
