<template>
  <q-card class="no-shadow grey-border">
    <q-toolbar
      class="toolbar"
      @click.self="$emit('toggleBoxCollapsed')"
    >
      <slot name="icon" />
      <q-toolbar-title>
        <slot name="name" />
      </q-toolbar-title>
      <slot name="tools" />
      <q-btn
        flat
        v-if="collapsible"
        class="card-arrow"
        @click="$emit('toggleBoxCollapsed')"
      >
        <i
          class="fa fa-angle-down arrow"
          :class="{ upsideDown: !collapsed }"/>
      </q-btn>
    </q-toolbar>
    <transition name="slide-toggle">
      <div
        class="content-div"
        v-show="!collapsed">
        <slot />
      </div>
    </transition>
  </q-card>
</template>

<script>
import { QSlideTransition, QCard, QToolbar, QToolbarTitle, QBtn } from 'quasar'
export default {
  components: { QSlideTransition, QCard, QToolbar, QToolbarTitle, QBtn },
  props: {
    collapsible: { default: false },
    collapsed: { default: false },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.toolbar
  min-height 40px
  height 40px
.card-arrow
  margin-left 1em
  cursor pointer
  min-width 30px
  .arrow
    transition: all .3s ease;
.upsideDown
  transform rotate(180deg)

.slide-toggle-enter-active,
.slide-toggle-leave-active
  transition max-height .2s
  overflow hidden
.slide-toggle-enter-active
    max-height 1000px
.slide-toggle-enter,
.slide-toggle-leave-active
    max-height 0
.slide-toggle-leave
    max-height 1000px
</style>
