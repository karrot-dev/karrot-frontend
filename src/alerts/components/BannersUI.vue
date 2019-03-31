<template>
  <div>
    <KBanner
      v-for="banner in formattedBanners"
      :key="banner.type"
      :color="banner.color"
      :icon="banner.icon"
      :position="banner.position"
      :actions="banner.actions || []"
      class="k-banner"
    >
      {{ $t(banner.message, banner.context) }}
    </KBanner>
  </div>
</template>

<script>
import { Dialog } from 'quasar'
import KBanner from '@/alerts/components/KBanner'

export default {
  components: { KBanner },
  props: {
    banners: {
      type: Array,
      required: true,
    },
  },
  computed: {
    formattedBanners () {
      return this.banners.map(banner => {
        return {
          ...this[banner.type](banner.context),
          ...banner,
        }
      }).filter(banner => {
        return !banner.desktopOnly || !this.$q.platform.is.mobile
      })
    },
  },
  methods: {
    awaitingAgreement (agreement) {
      return {
        color: 'negative',
        icon: 'pan_tool',
        message: 'AGREEMENT.AGREE',
        actions: [
          {
            label: this.$t('AGREEMENT.VIEW'),
            handler: () => {
              Dialog.create({
                title: agreement.title,
                message: agreement.content,
                cancel: this.$t('BUTTON.CANCEL'),
                ok: this.$t('BUTTON.AGREE'),
              })
                .then(() => this.$emit('agree', agreement.id))
                .catch(() => {})
            },
          },
        ],
      }
    },

    playgroundGroupInfo () {
      return {
        color: 'secondary',
        icon: 'fas fa-child',
        message: 'GROUP.PLAYGROUND_INFO',
        actions: [
          {
            label: this.$t('GROUP.JOIN_ANOTHER_GROUP'),
            handler: () => this.$router.push({ name: 'groupsGallery' }),
          },
        ],
      }
    },

    notConnected () {
      return {
        color: 'warning',
        icon: 'report_problem',
        message: 'GLOBAL.NOT_CONNECTED',
        actions: [
          {
            icon: 'refresh',
            handler: () => this.$emit('reconnect'),
          },
        ],
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
body.desktop .k-banner
  min-width 500px
</style>
