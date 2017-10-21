<template>
  <div class="user-slot-wrapper" v-bind:class="{ greyedOut: !showJoin, active: showJoin }" v-bind:style="{ width: size + 'px', height: size + 'px' }">
    <div v-bind:class="{ hoverHide: showJoin }">
    </div>
    <div v-if="hoverUser && showJoin" v-bind:class="{ hoverShow: showJoin }">
      <RandomPicture @click.native="$emit('join')"
        :name="hoverUser.displayName"
        :seed="hoverUser.id"
        :size="size">
      </RandomPicture>
      <q-tooltip>
        <span>{{ $t(popup) }}</span>
      </q-tooltip>
    </div>
  </div>
</template>

<script>
import { QTooltip } from 'quasar'
import RandomPicture from './RandomPicture.vue'

export default {
  props: {
    size: { default: 20 },
    popup: { default: 'PICKUPLIST.ITEM.JOIN' },
    hoverUser: { required: false },
    showJoin: { default: false },
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
