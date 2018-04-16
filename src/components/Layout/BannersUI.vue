<template>
  <div>
    <k-banner
      v-for="banner in formattedBanners"
      :key="banner.id"
      :class="bannerClasses"
      :color="banner.color"
      :icon="banner.icon"
      :position="banner.position"
      :dismissible="isDismissible(banner)"
      @dismiss="isDismissible(banner) && $emit('dismiss', banner.id)"
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

    isDismissible ({ id, dismissible }) {
      return id && !dismissible
    },

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

    bannerClasses () {
      return this.$q.platform.is.mobile ? {
        'fixed-top': true,
        'z-alert': true, // TODO: z-alert doesn't exist anymore
        'generic-padding': true,
      } : {}
    },
  },
  computed: {
    formattedBanners () {
      return this.banners.map(e => {
        return {
          ...this[e.type](e.context),
          ...e,
        }
      }).filter(e => {
        return !e.desktopOnly || !this.$q.platform.is.mobile
      })
    },
  },
}
</script>
