<template>
  <div
    class="user-slot-wrapper relative-position"
    :style="{ width: size + 'px', height: size + 'px' }"
    @click.stop="$emit('leave')"
  >
    <ProfilePicture
      class="profile-picture"
      :user="user"
      :size="size"
      :is-link="false"
    />
    <div
      class="absolute-full leave-icon"
      :style="{ 'font-size': size*0.8 + 'px' }"
      :title="$t('PICKUPLIST.ITEM.LEAVE')"
    >
      <i
        class="fas fa-fw fa-times"
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
      type: Object,
      required: true,
    },
    pickup: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.user-slot-wrapper
  cursor pointer
  .leave-icon
    visibility hidden
    color $negative
    border 2px dashed
    border-radius $borderRadius
    text-align center
    i
      display inline
.user-slot-wrapper:hover
  .leave-icon
    visibility visible
  .profile-picture
    visibility hidden
</style>
