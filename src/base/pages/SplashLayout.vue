<template>
  <div class="splashlayout-wrapper">
    <div class="splashlayout-header">
      <RouterView name="header" />
    </div>
    <div class="splashlayout">
      <div class="splashlayout-content">
        <Transition
          name="fade"
          mode="out-in"
        >
          <RouterView />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: { },
}
</script>

<!-- NOT SCOPED! Bad style, definitions should be moved into the respective components -->
<style lang="stylus">
@import '~variables'
.splashlayout-header
  padding 0.1em 1em
  img
    height 40px
    vertical-align middle
    margin-bottom: 20px
    margin-right: 10px
  img, h4
    display inline-block
  h4
    color $primary
.splashlayout-content
  overflow hidden
  border-radius $borderRadius
  width 100%
  min-height 5em
  background-color $primary
  color white
  padding 1em 1em
  .white-box
    background-color white
    border-radius $borderRadiusSmall
    padding .1em 1em
    margin-bottom .5em
    .q-field
      margin-top .2em
  .error
    color $warning
    margin 0 1em
  .actions
    float right
    color white
    .submit
      color white
      background-color $secondary
    .submit:hover
      background-color hover-color($secondary)
body.mobile .splashlayout-header
  display none
body.mobile .splashlayout
  padding .3em
body.desktop .splashlayout-wrapper
  margin-top 3em
.splashlayout
  .fade-enter-active, .fade-leave-active
    transition: all .1s
  .fade-enter, .fade-leave-to
    transform:rotateX(90deg)
</style>
