<template>
  <div class="amount shadow-1">
    {{ amount }}<span>kg</span>
  </div>
</template>

<script>

export default {
  props: {
    amount: { required: true },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.amount
  font-family Verdana, Geneva, Tahoma, sans-serif
  border-radius $borderRadius
  height 60px
  padding 0 10px
  font-size: 40px
  color $tertiary
  background-color $secondary
  font-family $accentFont
  display inline-block
  span
    margin-left 7px
</style>
