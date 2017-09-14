<template>
  <div>
    Hello {{ name }}!
  </div>
</template>

<script>
export default {
  props: {
    name: {
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
div
  padding: 20px
</style>
