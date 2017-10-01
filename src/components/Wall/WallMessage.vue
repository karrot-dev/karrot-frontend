<template>
    <WallCard>
      <template slot="icon">
        <ProfilePicture :user="message.author" :size="32"/>
      </template>
      <template slot="header">
      </template>
      <template slot="time">
        {{  $d(message.createdAt, 'long')  }}
      </template>
      <div> {{ message.content }} </div>
    </WallCard>
</template>

<script>
import WallCard from './WallCard.vue'
import ProfilePicture from '../ProfilePictures/ProfilePicture.vue'

export default {
  components: {
    WallCard, ProfilePicture,
  },
  props: {
    message: { required: true },
  },
}
</script>

<style scoped lang="stylus">
</style>
