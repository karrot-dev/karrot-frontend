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

<style scoped lang="sass">
.k-sidenav-box
  margin-bottom: 20px

.toolbar
  height: 40px
  min-height: 40px
</style>
