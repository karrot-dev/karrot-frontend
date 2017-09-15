<template>
  <div class="wall-card-wrapper">
    <div class="row justify-between">
      <div class="icon">
        <slot name="icon"/>
      </div>
      <div class="title">
        <slot name="header"/>
      </div>
      <div class="time">
        <slot name="time"/>
      </div>
    </div>
    <hr/>
    <div>
      <slot>Actual Content...</slot>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  }
}
</script>

<style scoped lang="stylus">
  .wall-card-wrapper
    padding 0.5em
    border 1px solid grey
    border-radius 7px
    margin-bottom 1em
    .icon
      height 32px
      width 40px
      overflow hidden
</style>