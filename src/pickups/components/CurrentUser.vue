<template>
  <a
    @click.stop="$emit('leave')"
    class="user-slot-wrapper"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <div class="hoverShow">
      <i
        v-if="!pickup.hasStarted"
        :style="{fontSize: (size - 9) + 'px'}"
        class="fas fa-fw fa-times"
        :title="$t('PICKUPLIST.ITEM.LEAVE')"
      />
    </div>
    <div class="hoverHide">
      <ProfilePicture
        :user="user"
        :size="size"
        :is-link="false"
      />
    </div>
  </a>
</template>

<script>
import ProfilePicture from '@/users/components/ProfilePicture'

export default {
  props: {
    size: {
      type: Number,
      default: 20,
    },
    user: {
      type: Object,
      required: true,
    },
    pickup: {
      type: Object,
      required: true,
    },
  },
  components: {
    ProfilePicture,
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.user-slot-wrapper
  cursor pointer
  color $negative
  .hoverShow
    display none
.user-slot-wrapper:hover
  display inline-block
  border 2px dashed
  border-radius $borderRadius
  text-align center
  span
    vertical-align middle
    font-weight 600
  .hoverHide
    display none
  .hoverShow
    display inline-block
    height 100%
    width 100%
</style>
