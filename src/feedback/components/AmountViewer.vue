<template>
  <div class="wrapper row no-wrap ellipsis">
    <img
      v-for="(photoSrc, idx) in photosArray"
      :key="idx"
      :src="photoSrc"
    >
  </div>
</template>

<script>
import appleImg from '@/feedback/assets/apple.png'
import appleGuyImg from '@/feedback/assets/appleGuy.png'
import bagImg from '@/feedback/assets/bag.png'
import cartImg from '@/feedback/assets/cart.png'
import flourImg from '@/feedback/assets/flour.png'
import flourGuyImg from '@/feedback/assets/flourGuy.png'
import milkImg from '@/feedback/assets/milk.png'

export default {
  props: {
    amount: {
      default: null,
      type: Number,
    },
  },
  data () {
    return {
      selectedValue: 3.0,
      appleImg,
    }
  },
  computed: {
    photosArray () {
      let amount = this.amount || 0
      const amountImages = []
      while (amount >= 0.15 && amountImages.length < 7) {
        if (amount >= 50.0) {
          amountImages.push(cartImg)
          amount -= 50.0
          continue
        }
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
    },
  },
}
</script>

<style scoped lang="sass">
.wrapper
  .amount
    margin-right: .6em

  img
    height: 60px
</style>
