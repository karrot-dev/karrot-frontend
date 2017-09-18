<template>
  <div>
    <Navbar class="mobile-only"/>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Group/Navbar'
export default {
  components: { Navbar },
}
</script>


<style scoped lang="stylus">
</style>
