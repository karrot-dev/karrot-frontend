<template>
  <div>
    <img :src="logo">
  </div>
</template>

<script>
export default {
  components: {},
  computed: {
    logo () {
      return KARROT_THEME === 'dev' ? require('@/assets/carrot-logo.dev.svg') : require('@/assets/carrot-logo.svg')
    },
  },
}
</script>

<style scoped lang="stylus">
  div, img
    height: 95%
</style>
