<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<template>
  <QBanner class="q-ma-lg q-pa-lg bg-secondary text-white">
    <template #avatar>
      <slot name="icon" />
    </template>
    <h5 class="q-ma-none">
      <slot />
    </h5>
    <slot name="desc" />
    <template #action>
      <slot name="action" />
    </template>
  </QBanner>
</template>

<script>
import { QBanner } from 'quasar'

export default {
  components: {
    QBanner,
  },
}
</script>
