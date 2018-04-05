<template>
  <q-btn
    @click="$emit('click')"
    class="row no-wrap items-center"
    flat
  >
    <div
      class="pencil" />
    <slot />
  </q-btn>
</template>

<script>
import { QBtn } from 'quasar'

export default {
  components: { QBtn },
}
</script>

<style scoped lang="stylus">
.q-btn
  padding 1px 3px
  .pencil
    >>> img.pencil
      height 1em
      width 1em
      margin .1em .1em
      vertical-align middle
</style>
