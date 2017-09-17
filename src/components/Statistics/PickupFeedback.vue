<template>
  <div class="wrapper">
    <div class="row justify-inbetween no-wrap image-and-text">
      <div class="image-and-text-left">
        <img style="width: 100%" :src="cartImg">
      </div>
      <div class="image-and-text-right">
        <h3>{{$t("PICKUP_FEEDBACK.HEADER")}}</h3>
        <p>{{$t("PICKUP_FEEDBACK.SUBTITLE")}}</p>
      </div>
    </div>
    <AmountPicker/>
  </div>
</template>

<script>
import AmountPicker from './AmountPicker'
import cartImg from '@/assets/people/cart.png'

export default {
  components: { AmountPicker },
  data () {
    return {
      cartImg,
    }
  },
}
</script>

<style scoped lang="stylus">
.image-and-text
  margin-bottom 4.5em
  .image-and-text-left
    width 30%
    max-width 20em
    padding 2em
  .image-and-text-right
    margin auto
</style>
