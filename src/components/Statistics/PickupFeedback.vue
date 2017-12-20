<template>
  <div class="wrapper">
    <div class="row justify-inbetween no-wrap image-and-text">
      <div class="image-and-text-left">
        <img style="width: 100%" :src="cartImg">
      </div>
      <div class="image-and-text-right">
        <h3>{{ $t('PICKUP_FEEDBACK.HEADER') }}</h3>
        <p>{{ $t('PICKUP_FEEDBACK.SUBTITLE') }}</p>
      </div>
    </div>
    <AmountPicker/>
    <q-field
      icon="fa-star"
      :label="$t('PICKUP_FEEDBACK.COMMENT')"
      :helper="$t('PICKUP_FEEDBACK.COMMENT_PLACEHOLDER')">
      <q-input
        v-model="comment"
        autocomplete="off"
      />
    </q-field>
  </div>
</template>

<script>
import { QField, QInput } from 'quasar'
import AmountPicker from './AmountPicker'
import cartImg from 'assets/people/cart.png'

export default {
  components: { QField, QInput, AmountPicker },
  data () {
    return {
      comment: '',
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
