<template>
  <div class="user-slot-wrapper" v-bind:style="{ width: size + 'px', height: size + 'px' }">
    <div v-bind:class="{ hoverHide: showJoin }">
    </div>
    <div v-if="showJoin" v-bind:class="{ hoverShow: showJoin }">
      <RandomPicture @click.native="$emit('join')"
        :name="currentUser.displayName"
        :seed="currentUser.id"
        :size="size">
      </RandomPicture>
      <q-tooltip>
        <span>{{$t(popup)}}</span>
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
    currentUser: { required: false },
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
    cursor pointer
    display inline-block
    border 2px dashed
    border-radius $borderRadius
    text-align center
    span
      vertical-align middle
      font-weight 600
    .hoverShow
      display none
  .user-slot-wrapper:hover
    border: 0
    .hoverHide
      display none
    .hoverShow
      display inline-block
</style>
