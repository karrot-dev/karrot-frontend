<template>
  <div class="wrapper">
    <router-link v-if="user" :to="{name:'user', params: {userId: user.id}}">
      <RandomPicture :name="user.displayName" :seed="user.id" :size="size"></RandomPicture>
      <q-tooltip>
        {{ user.displayName }}
      </q-tooltip>
    </router-link>

    <span v-if="!user">
      <span>?</span>
      <q-tooltip>
        <span>{{$t('PROFILE.INACCESSIBLE_OR_DELETED')}}</span>
      </q-tooltip>
    </span>
  </div>
</template>

<script>
import { QTooltip } from 'quasar'
import RandomPicture from './RandomPicture'

export default {
  props: {
    user: { required: true },
    size: {
      default: 20,
    },
  },
  components: {
    QTooltip, RandomPicture,
  },
}
</script>

<style scoped lang="stylus">
  .wrapper
    display inline-block
</style>
