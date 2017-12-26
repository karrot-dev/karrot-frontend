<template>
  <div
    class="user-slot-wrapper"
    :class="{ greyedOut: !showJoin, active: showJoin }"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <div :class="{ hoverHide: showJoin }"/>
    <div
      v-if="hoverUser && showJoin"
      :class="{ hoverShow: showJoin }"
    >
      <RandomPicture
        @click.native="$emit('join')"
        :name="hoverUser.displayName"
        :seed="hoverUser.id"
        :size="size"
      />
      <q-tooltip>
        <span>
          {{ $t('PICKUPLIST.ITEM.JOIN') }}
        </span>
      </q-tooltip>
    </div>
  </div>
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
    hoverUser: {
      default: null,
      type: Object,
    },
    showJoin: {
      default: false,
      type: Boolean,
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
    border 2px dashed
    border-radius $borderRadius
    margin-right 3.8px
    margin-bottom 3.8px
    background-color rgba(255, 255, 255, 0.7)
    span
      vertical-align middle
      font-weight 600
  .user-slot-wrapper.active
    cursor pointer
    display inline-block
    text-align center
    .hoverShow
      display none
  .user-slot-wrapper.active:hover
    border: 0
    .hoverHide
      display none
    .hoverShow
      display inline-block
  .greyedOut
    border-color lightgrey
    cursor ini
</style>
