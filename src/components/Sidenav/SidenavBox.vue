<template>
  <q-card class="no-shadow grey-border">
    <q-toolbar class="toolbar">
      <slot name="icon" />
      <q-toolbar-title>
        <slot name="name" />
      </q-toolbar-title>
      <slot name="tools" />
    </q-toolbar>
    <div class="content">
      <slot />
    </div>
  </q-card>
</template>

<script>
import { QCard, QToolbar, QToolbarTitle } from 'quasar'
export default {
  components: { QCard, QToolbar, QToolbarTitle },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.toolbar
  min-height 40px
  height 40px
</style>
