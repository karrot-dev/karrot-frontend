<template>
  <div
    class="wrapper"
    :style="pictureStyle"
  >
    <template v-if="user && user.id">
      <router-link
        v-if="isLink"
        :to="{name:'user', params: {userId: user.id}}"
        :title="user.displayName"
      >
        <img
          v-if="hasPhoto"
          :src="photo"
          :width="size"
          :height="size"
        >
        <RandomArt
          v-else
          :text="user.displayName"
          :seed="user.id"
          class="randomArt"
          :style="pictureStyle"
        />
      </router-link>
      <div v-else>
        <img
          v-if="hasPhoto"
          :src="photo"
          :width="size"
          :height="size"
        >
        <RandomArt
          v-else
          :text="user.displayName"
          :seed="user.id"
          class="randomArt"
          :style="pictureStyle"
        />
      </div>
    </template>
    <div
      v-else
      class="deletedUser"
      :style="deletedUserStyle"
      :title="$t('PROFILE.INACCESSIBLE_OR_DELETED')"
    >?</div>
  </div>
</template>

<script>
import RandomArt from '@/components/General/RandomArt'

export default {
  props: {
    user: { default: null, type: Object },
    size: { default: 20, type: Number },
    isLink: { default: true, type: Boolean },
  },
  components: {
    RandomArt,
  },
  computed: {
    pictureStyle () {
      return {
        width: this.size + 'px',
        height: this.size + 'px',
      }
    },
    deletedUserStyle () {
      return {
        ...this.pictureStyle,
        'font-size': this.size * 0.8 + 'px',
      }
    },
    bigPhoto () {
      return this.size > 120
    },
    hasPhoto () {
      return !!this.photo
    },
    photo () {
      if (this.user && this.user.photoUrls) {
        const p = this.user.photoUrls
        return this.bigPhoto ? p.fullSize : p.thumbnail
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.wrapper
  display inline-block
.randomArt
  display block
  overflow hidden
.deletedUser
  display flex
  justify-content center
  align-items center
  user-select none
</style>
