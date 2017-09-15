<template>
    <WallCard>
      <template slot="icon">
        <div class="icon">
          <i class="fa fa-shopping-cart"/>
        </div>
      </template>
      <template slot="header">
        <div><ProfilePicture :user="feedback.given_by"/></div>
        <div>wrote a message</div>
      </template>
      <template slot="time">
        {{ feedback.created_at }}
      </template>
      <div> {{ feedback.comment }} </div>
    </WallCard>
</template>

<script>
import WallCard from './WallCard.vue'
import ProfilePicture from '../ProfilePictures/ProfilePicture.vue'

export default {
  components: {
    WallCard, ProfilePicture
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
  color $secondary
  .fa
    line-height 32px
    vertical-align middle
    text-align center
    margin-left 10px
.header div
  display inline-block
  vertical-align middle
</style>