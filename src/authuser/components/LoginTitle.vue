<template>
  <div>
    <img :src="loginImage">
    <h4>{{ $t('LOGIN.TITLE') }}</h4>
  </div>
</template>

<script>
import loginImage from 'authuser/assets/cherry.png'

export default {
  components: { },
  data () {
    return {
      loginImage,
    }
  },
}
</script>

<style scoped lang="stylus">
</style>
