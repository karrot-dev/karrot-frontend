<template>
  <div>
    <img :src="loginImage">
    <h4>{{ $t('SIGNUP.TITLE') }}</h4>
  </div>
</template>

<script>
import loginImage from '@/assets/people/cherry.png'

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
