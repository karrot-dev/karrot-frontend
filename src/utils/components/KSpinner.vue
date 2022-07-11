<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<template>
  <div class="full-width text-center generic-padding">
    <QSpinnerDots :size="40" />
  </div>
</template>

<script>
import { QSpinnerDots } from 'quasar'

export default {
  components: { QSpinnerDots },
}
</script>
