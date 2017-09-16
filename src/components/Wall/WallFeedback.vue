<template>
    <WallCard>
      <template slot="icon">
        <div class="icon">
          <i class="fa fa-shopping-cart"/>
        </div>
      </template>
      <template slot="header">
        <div><ProfilePicture :user="feedback.givenBy"/></div>
        <div>picked up food</div>
      </template>
      <template slot="time">
        {{ $d(new Date(feedback.createdAt), 'short') }}
      </template>
      <AmountBox :amount="feedback.weight"/>
      <div class="comment"> {{ feedback.comment }} </div>
    </WallCard>
</template>

<script>
import WallCard from './WallCard.vue'
import AmountBox from '../Statistics/AmountBox'
import ProfilePicture from '../ProfilePictures/ProfilePicture.vue'

export default {
  components: {
    WallCard, ProfilePicture, AmountBox
  },
  props: {
    feedback: { required: true }
  }
}
</script>

<style scoped lang="stylus">
@import '~variables'

.icon
  height 32px
  width 32px
  background-color $primary
  color $tertiary
  .fa
    line-height 32px
    vertical-align middle
    text-align center
    margin-left 10px
.header div
  display inline-block
  vertical-align middle
<<<<<<< HEAD
.comment
  display inline-block
  vertical-align middle
  margin-left .6em
</style>
=======
</style>
>>>>>>> camelize
