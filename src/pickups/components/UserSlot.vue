<template>
  <div
    class="user-slot-wrapper"
    :class="{ greyedOut: !showJoin, active: showJoin }"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <div :class="{ hoverHide: showJoin }" />
    <div
      v-if="hoverUser && showJoin"
      :class="{ hoverShow: showJoin }"
      :title="$t('PICKUPLIST.ITEM.JOIN')"
    >
      <ProfilePicture
        :user="hoverUser"
        :size="size"
        :is-link="false"
        @click.native.stop="$emit('join')"
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
    hoverUser: {
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
    font-weight 600;
    vertical-align middle

.user-slot-wrapper.active
  display inline-block
  text-align center
  cursor pointer

  .hoverShow
    display none

.user-slot-wrapper.active:hover
  border: 0

  .hoverHide
    display none

  .hoverShow
    display inline-block

.greyedOut
  cursor ini;
  border-color lightgrey
</style>
