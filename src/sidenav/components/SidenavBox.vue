<template>
  <div
    class="k-sidenav-box"
    :class="{ expandable }"
  >
    <QToolbar
      class="toolbar"
      inverted
      @click.native.stop.self="$emit('toggle')"
    >
      <slot name="icon" />
      <QToolbarTitle
        @click.native.stop.self="$emit('toggle')"
      >
        <slot name="name" />
      </QToolbarTitle>
      <slot name="tools" />
      <QBtn
        v-if="expandable"
        flat
        round
        dense
        size="sm"
        class="card-arrow"
        @click.stop="$emit('toggle')"
      >
        <QIcon
          name="fas fa-angle-down arrow"
          :class="{ upsideDown: expanded }"
        />
      </QBtn>
    </QToolbar>
    <Transition name="slide-toggle">
      <div v-show="expanded">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script>
import { QSlideTransition, QCard, QToolbar, QToolbarTitle, QBtn, QIcon } from 'quasar'
export default {
  components: { QSlideTransition, QCard, QToolbar, QToolbarTitle, QBtn, QIcon },
  props: {
    expandable: { default: true, type: Boolean },
    expanded: { default: true, type: Boolean },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
@import '~slidetoggle'

.k-sidenav-box
  margin-bottom 20px
  &.expandable
    .toolbar
      cursor pointer
.toolbar
  min-height 40px
  height 40px
.card-arrow
  .arrow
    transition: all .3s ease;
.upsideDown
  transform rotate(180deg)
</style>
