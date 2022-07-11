<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

<template>
  <div class="absolute-full column">
    <DetailHeader
      class="col-auto"
      @close="$emit('close')"
    />
    <Detail
      class="col relative-position"
      inline
    />
  </div>
</template>

<script>
import DetailHeader from './DetailHeader'
import Detail from './Detail'

export default {
  components: {
    DetailHeader,
    Detail,
  },
  emits: [
    'close',
  ],
}
</script>
