<template>
  <div
    class="k-sidenav-box"
  >
    <QToolbar
      class="toolbar"
      inverted
    >
      <slot name="icon" />
      <QToolbarTitle>
        <slot name="name" />
      </QToolbarTitle>
      <slot name="tools" />
    </QToolbar>
    <slot />
  </div>
</template>

<script>
import {
  QToolbar,
  QToolbarTitle,
} from 'quasar'
export default {
  components: {
    QToolbar,
    QToolbarTitle,
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.k-sidenav-box
  margin-bottom 20px
.toolbar
  min-height 40px
  height 40px
</style>
