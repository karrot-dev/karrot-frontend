<template>
  <div class="wrapper">
    <div class="row justify-between toolbar">
      <div class="name"><slot name="name">"name"-Slot</slot></div>
      <div><slot name="tools">"tools"-Slot</slot></div>
    </div>
    <div class="content">
      <slot>Primary Slot</slot>
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
@import '~variables'

.wrapper
  width 100%
  margin .6em
  border 1px solid grey
  border-radius 10px
  .toolbar
    border-radius 10px 10px 0 0
    background-color $primary
    padding .6em
    color white
    .name
      margin auto 0
      font-weight 500
      font-size 1.3em 
  .content
    padding .6em

</style>