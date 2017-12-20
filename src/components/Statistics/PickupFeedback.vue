<template>
  <div class="wrapper">
    <div class="row justify-inbetween no-wrap image-and-text">
      <div class="image-and-text-left gt-sm">
        <img style="width: 100%;" :src="cartImg">
      </div>
      <div class="image-and-text-right">
        <h4>{{ $t('PICKUP_FEEDBACK.HEADER') }}</h4>
        <p>{{ $t('PICKUP_FEEDBACK.SUBTITLE') }}</p>
      </div>
    </div>
    <div style="padding: 0 1.5em">
      <AmountPicker/>
      <q-field
        style="margin-top: 2em; padding: 0 .5em"
        icon="fa-star"
        :label="$t('PICKUP_FEEDBACK.COMMENT')">
        <q-input
          v-model="comment"
          type="textarea"
          :placeholder="$t('PICKUP_FEEDBACK.COMMENT_PLACEHOLDER')"
          autocomplete="off"
          :min-rows="2"
        />
      </q-field>
      <div style="margin-top: 1.5em; padding-bottom: 1em">
        <q-btn type="submit" class="actionButton" color="primary">{{ $t('BUTTON.CREATE') }}</q-btn>
        <div style="clear: both"/>
      </div>
    </div>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import AmountPicker from './AmountPicker'
import cartImg from 'assets/people/cart.png'

export default {
  components: { QField, QInput, QBtn, AmountPicker },
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
    max-width 10em
    margin auto
    padding 1em
  .image-and-text-right
    width: 70%
    margin 0 auto
.actionButton
  float: right
</style>
