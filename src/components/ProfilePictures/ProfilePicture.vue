<template>
  <div class="wrapper">
    <router-link
      v-if="isLink && user"
      :to="{name:'user', params: {userId: user.id}}"
    >
      <img
        v-if="hasPhoto"
        :src="photo"
        :style="pictureStyle"
      >
      <RandomArt
        v-else
        :text="user.displayName"
        :seed="user.id"
        class="randomArt"
        :style="pictureStyle"
      />
      <q-tooltip>
        {{ user.displayName }}
      </q-tooltip>
    </router-link>
    <div v-if="!isLink && user">
      <img
        v-if="hasPhoto"
        :src="photo"
        :style="pictureStyle"
      >
      <RandomArt
        v-else
        :text="user.displayName"
        :seed="user.id"
        class="randomArt"
        :style="pictureStyle"
      />
    </div>
    <span v-if="!user">
      <span>?</span>
      <q-tooltip>
        <span>
          {{ $t('PROFILE.INACCESSIBLE_OR_DELETED') }}
        </span>
      </q-tooltip>
    </span>
  </div>
</template>

<script>
import { QTooltip } from 'quasar'
import RandomArt from '@/components/General/RandomArt'

export default {
  props: {
    user: { required: true },
    size: { default: 20 },
    isLink: { default: true },
  },
  components: {
    QTooltip, RandomArt,
  },
  computed: {
    pictureStyle () {
      return { width: this.size + 'px', height: this.size + 'px' }
    },
    bigPhoto () {
      return this.size > 120
    },
    hasPhoto () {
      return !!this.photo
    },
    photo () {
      if (this.user && this.user.photo) {
        const p = this.user.photo
        return this.bigPhoto ? p.fullSize : p.thumbnail
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.wrapper
  display inline-block
.randomArt
  display block
  overflow hidden
</style>
