<template>
  <div class="splashlayout-wrapper">
    <div class="splashlayout-header">
      <RouterView name="header" />
    </div>
    <div class="splashlayout">
      <div class="splashlayout-content rounded-borders">
        <RouterView v-slot="{ Component }">
          <Transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </Transition>
        </RouterView>
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
<style lang="sass">
.splashlayout-header
  padding: 0.1em 1em

  img
    height: 40px
    margin-right: 10px
    margin-bottom: 20px
    vertical-align: middle

  img, h4
    display: inline-block

  h4
    color: $primary

.splashlayout-content
  width: 100%
  min-height: 5em
  padding: 1.2em 1em
  overflow: hidden
  color: white
  background-color: $primary

  .actions
    float: right
    color: white

    .submit
      color: white
      background-color: $secondary

    .submit:hover
      background-color: hover-color($secondary)

body.mobile .splashlayout-header
  display: none

body.mobile .splashlayout
  padding: .3em

body.desktop .splashlayout-wrapper
  margin-top: 3em

.splashlayout
  .fade-enter-active, .fade-leave-active
    transition: all .1s

  .fade-enter, .fade-leave-to
    transform: rotateX(90deg)
</style>
