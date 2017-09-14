<template>
  <div>
    <Topbar/>
    <div class="content row justify-around ">
      <div class="sidenav">
        <slot name="sidenav"/>
      </div>
      <div class="main">
        <slot>Content</slot>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>

import Topbar from './Topbar.vue'
import Footer from './Footer.vue'

export default {
  components: {Topbar, Footer}
}
</script>

<style scoped lang="stylus">
  .sidenav
    width 22%
    min-width 20em
  .main
    width 60%
  .content
    margin-bottom 1em
</style>