<template>
  <div class="wall-card-wrapper">
    <div class="row no-wrap justify-between header">
      <div class="icon">
        <slot name="icon">"icon"-slot</slot>
      </div>
      <div class="title">
        <slot name="header">Slot</slot>
      </div>
      <div class="time">
        <slot name="time">"time"-Slot</slot>
      </div>
    </div>
    <div class="content">
      <slot>Actual Content...</slot>
    </div>
  </div>
</template>

<script>

export default {
}
</script>

<style scoped lang="stylus">
@import '~variables'

.wall-card-wrapper
  border 1px solid grey
  border-radius 5px
  margin-bottom 1em
  .header
    border 1px solid grey
    border-radius 5px 5px 0 0
    height 34px
    padding 0
    background-color $secondary
    color $primary
  .title, .time
    margin auto 0
    padding 0 .3em
    overflow hidden
    text-overflow ellipsis
    white-space: nowrap
  .icon
    height 32px
    width 40px
    overflow hidden
  .content
    padding .5em
</style>