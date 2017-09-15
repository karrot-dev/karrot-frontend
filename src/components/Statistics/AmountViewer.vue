<template>
  <div class="wrapper row">
    <div class="amount">
      {{amount}}kg
    </div>
    <img v-for="(photoSrc, idx) in photosArray" :src="photoSrc" :key="idx"/>
  </div>
</template>

<script>
import appleImg from '@/assets/feedback/apple.png'
import appleGuyImg from '@/assets/feedback/appleGuy.png'
import bagImg from '@/assets/feedback/bag.png'
// import cartImg from '@/assets/feedback/cart.png'
import flourImg from '@/assets/feedback/flour.png'
import flourGuyImg from '@/assets/feedback/flourGuy.png'
import milkImg from '@/assets/feedback/milk.png'

export default {
  data () {
    return {
      selectedValue: 3.0,
      appleImg
    }
  },
  props: {
    amount: {
      required: true
    }
  },
  computed: {
    photosArray () {
      let amount = this.amount
      let amountImages = []
      console.log('selected', this.amount)
      console.log(amountImages)
      while (amount >= 0.15) {
        if (amount >= 6.0) {
          amountImages.push(bagImg)
          amount -= 6.0
          continue
        }
        if (amount >= 1.0 && Math.random() < 0.7) {
          amountImages.push(milkImg)
          amount -= 1.0
          continue
        }
        if (amount >= 0.5 && Math.random() < 0.9) {
          if (Math.random() > 0.9) {
            amountImages.push(flourGuyImg)
          }
          else {
            amountImages.push(flourImg)
          }
          amount -= 0.5
          continue
        }
        if (Math.random() > 0.9) {
          amountImages.push(appleGuyImg)
        }
        else {
          amountImages.push(appleImg)
        }
        amount -= 0.15
      }
      return amountImages
    }
  }
}
</script>

<style scoped lang="stylus">
.wrapper
  img, .amount
    font-family Verdana, Geneva, Tahoma, sans-serif
  .amount
    border 1px solid grey
    border-radius 5px
    height 60px
    padding 0 10px
    margin-right 1em
    font-size: 40px
  img
    height 60px
</style>
