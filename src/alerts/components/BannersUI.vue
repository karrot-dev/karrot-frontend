<template>
  <div>
    <QBanner
      v-for="{ type, icon, className, action, message, context } in formattedBanners"
      :key="type"
      class="k-banner"
      style="min-height: unset"
      inline-actions
      :class="className"
    >
      {{ $t(message, context) }}
      <template #avatar>
        <QIcon
          :name="icon"
          size="1.4em"
        />
      </template>
      <template #action>
        <QBtn
          v-if="action"
          flat
          dense
          :icon="action.icon"
          :label="action.label"
          @click="action.handler()"
        />
      </template>
    </QBanner>
  </div>
</template>

<script>
import {
  QBanner,
  QIcon,
  QBtn,
  Dialog,
} from 'quasar'

export default {
  components: {
    QBanner,
    QIcon,
    QBtn,
  },
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
        className: 'bg-negative',
        icon: 'pan_tool',
        message: 'AGREEMENT.AGREE',
        action: {
          label: this.$t('AGREEMENT.VIEW'),
          handler: () => {
            Dialog.create({
              title: agreement.title,
              message: agreement.content,
              cancel: this.$t('BUTTON.CANCEL'),
              ok: this.$t('BUTTON.AGREE'),
            })
              .onOk(() => this.$emit('agree', agreement.id))
          },
        },
      }
    },

    playgroundGroupInfo () {
      return {
        className: 'bg-secondary text-white',
        icon: 'fas fa-child',
        message: 'GROUP.PLAYGROUND_INFO',
        action: {
          label: this.$t('GROUP.JOIN_ANOTHER_GROUP'),
          handler: () => this.$router.push({ name: 'groupsGallery' }).catch(() => {}),
        },
      }
    },

    notConnected ({ reconnecting }) {
      return {
        className: 'bg-warning text-white',
        icon: 'report_problem',
        message: reconnecting
          ? 'GLOBAL.RECONNECTING'
          : 'GLOBAL.OFFLINE_RECONNECT',
        action: reconnecting
          ? null
          : ({
              icon: 'refresh',
              handler: () => this.$emit('reconnect'),
            }),
      }
    },

    updateAvailable () {
      return {
        className: 'bg-blue text-white',
        icon: 'new_releases',
        message: 'UPDATE_AVAILABLE.DETAIL',
        action: {
          label: this.$t('UPDATE_AVAILABLE.RELOAD'),
          handler: () => window.location.reload(),
        },
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
body.desktop .k-banner
  min-width 500px

.k-banner >>> .q-banner__avatar
  align-self center
</style>
