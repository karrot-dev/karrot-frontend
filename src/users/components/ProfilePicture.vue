<template>
  <div
    class="wrapper"
    :style="pictureStyle"
  >
    <template v-if="user && user.id">
      <RouterLink
        v-if="isLink"
        :to="{name:'user', params: {userId: user.id}}"
        :title="tooltip"
        @click.stop=""
      >
        <img
          v-if="hasPhoto"
          :src="photo"
          class="fill"
        >
        <RandomArt
          v-else
          :text="user.displayName"
          :seed="user.id"
          class="randomArt fill"
        />
      </RouterLink>
      <img
        v-else-if="hasPhoto"
        :src="photo"
        class="fill"
      >
      <RandomArt
        v-else
        :text="user.displayName"
        :seed="user.id"
        class="randomArt fill"
      />
    </template>
  </div>
</template>

<script>
import RandomArt from '@/utils/components/RandomArt'

export default {
  components: {
    RandomArt,
  },
  props: {
    user: { default: null, type: Object },
    // Old style enrichment includes the membership for the current group on the user object
    // New style you pass it in explicitly
    membership: { default: null, type: Object },
    size: { default: 20, type: Number },
    isLink: { default: true, type: Boolean },
  },
  computed: {
    userMembership () {
      if (this.membership) return this.membership
      return this.user?.membership
    },
    tooltip () {
      if (this.user.displayName === '?') {
        return this.$t('PROFILE.INACCESSIBLE_OR_DELETED')
      }
      if (!this.userMembership || this.userMembership.roles.includes('editor')) {
        return this.user.displayName
      }
      const role = this.$t('USERDATA.NEWCOMER')
      return `${this.user.displayName} (${role})`
    },
    pictureStyle () {
      return {
        width: this.size + 'px',
        height: this.size + 'px',
      }
    },
    hasPhoto () {
      return !!this.photo
    },
    photo () {
      if (this.user && this.user.photoUrls) {
        const p = this.user.photoUrls
        return this.size > 120 ? p['600'] : p.thumbnail
      }
      return null
    },
  },
  watch: {
    user: {
      immediate: true,
      handler (val) {
        if (process.env.DEV) {
          if (val?.membership) {
            console.warn('Karrot: deprecated use of user enriched with membership', val)
          }
        }
      },
    },
  },
}
</script>

<style scoped lang="sass">
.wrapper
  display: inline-block

.randomArt
  display: block
  overflow: hidden

.fill
  width: 100%
  height: 100%
</style>
