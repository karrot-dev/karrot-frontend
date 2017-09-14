<template>
  <div class="wrapper">
    <a v-if="user">
      <RandomPicture :name="user.display_name" :seed="user.id" :size="size"></RandomPicture>
      <q-tooltip>
        {{ user.display_name }}
      </q-tooltip>
    </a>

    <span v-if="!user">
      <span>?</span>
      <q-tooltip>
        <span translate="PROFILE.INACCESSIBLE_OR_DELETED">PROFILE.INACCESSIBLE_OR_DELETED</span>
      </q-tooltip>
    </span>
  </div>
</template>

<script>
import { QTooltip } from 'quasar'
import RandomPicture from './RandomPicture.vue'

export default {
  props: {
    user: {
      required: true
    },
    size: {
      default: 30
    }
  },
  components: {
    QTooltip, RandomPicture
  }
}
</script>

<style scoped lang="stylus">
  .wrapper
    display inline-block
    margin .2em
</style>