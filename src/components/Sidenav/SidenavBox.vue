<template>
  <div>
    <!--
    <q-toolbar
      class="toolbar"
      @click.self="$emit('toggle')"
    >
      <slot name="icon" />
      <q-toolbar-title>
        <slot name="name" />
      </q-toolbar-title>
      <slot name="tools" />
      <q-btn
        flat
        round
        dense
        size="sm"
        class="card-arrow"
        @click="$emit('toggle')"
      >
        <q-icon
          name="fas fa-angle-down arrow"
          :class="{ upsideDown: expanded }"
        />
      </q-btn>
    </q-toolbar>
    -->
    <transition name="slide-toggle">
      <div v-show="expanded">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
import { QSlideTransition, QCard, QToolbar, QToolbarTitle, QBtn, QIcon } from 'quasar'
export default {
  components: { QSlideTransition, QCard, QToolbar, QToolbarTitle, QBtn, QIcon },
  props: {
    expanded: { default: true, type: Boolean },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
@import '~slidetoggle'

.toolbar
  min-height 40px
  height 40px
.card-arrow
  .arrow
    transition: all .3s ease;
.upsideDown
  transform rotate(180deg)
</style>
