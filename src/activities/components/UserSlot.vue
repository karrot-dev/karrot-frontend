<template>
  <div
    class="user-slot-wrapper"
    :class="{ greyedOut: !showJoin, active: showJoin }"
    :style="{ width: size + 'px', height: size + 'px' }"
    @click.stop="showJoin ? $emit('join') : null"
  >
    <div
      v-if="user && showJoin"
      :class="{ 'show-picture-on-hover': showJoin }"
      :title="$t('ACTIVITYLIST.ITEM.JOIN')"
    >
      <ProfilePicture
        :user="user"
        :size="size"
        :is-link="false"
      />
    </div>
  </div>
</template>

<script>
import ProfilePicture from '@/users/components/ProfilePicture'

export default {
  components: {
    ProfilePicture,
  },
  props: {
    size: {
      type: Number,
      default: 20,
    },
    user: {
      default: null,
      type: Object,
    },
    showJoin: {
      default: false,
      type: Boolean,
    },
  },

}
</script>

<style scoped lang="stylus">
@import '~variables'

.user-slot-wrapper
  margin-right 3.8px
  margin-bottom 3.8px
  background-color rgba(255, 255, 255, 0.7)
  border 2px dashed
  border-radius 0

  span
    font-weight 600
    vertical-align middle

.user-slot-wrapper.active
  display inline-block
  text-align center
  cursor pointer

  .show-picture-on-hover
    display none

// ios safari will require two clicks if we define a hover state
// so only use the hover thing when the browser can support hover properly
// see https://css-tricks.com/annoying-mobile-double-tap-link-issue/
@media (hover)
  .user-slot-wrapper.active:hover
    border 0

    .show-picture-on-hover
      display inline-block

.greyedOut
  cursor default
  border-color lightgrey
</style>
