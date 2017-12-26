<template>
  <a
    @click="$emit('leave')"
    class="user-slot-wrapper"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <div class="hoverShow">
      <i
        :style="{fontSize: (size - 9) + 'px'}"
        class="fa fa-fw fa-times"
      />
    </div>
    <q-tooltip>
      <span>{{ $t('PICKUPLIST.ITEM.LEAVE') }}</span>
    </q-tooltip>
    <div class="hoverHide">
      <RandomPicture
        :name="user.displayName"
        :seed="user.id"
        :size="size"
      />
    </div>
  </a>
</template>

<script>
import { QTooltip } from 'quasar'
import RandomPicture from '@/components/ProfilePictures/RandomPicture'

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
  },
  components: {
    QTooltip, RandomPicture,
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
      widht 100%
</style>
