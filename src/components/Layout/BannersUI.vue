<template>
  <div>
    <k-banner
      v-for="banner in formattedBanners"
      :key="banner.type"
      :color="banner.color"
      :icon="banner.icon"
      :position="banner.position"
      :actions="banner.actions || []"
    >
      {{ $t(banner.message, banner.context) }}
    </k-banner>
  </div>
</template>

<script>
import { Dialog } from 'quasar'
import KBanner from '@/components/Layout/KBanner'

export default {
  components: { KBanner },
  props: {
    banners: {
      type: Array,
      required: true,
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
        color: 'positive',
        icon: 'fa-child',
        message: 'GROUP.PLAYGROUND_INFO',
      }
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
}
</script>
