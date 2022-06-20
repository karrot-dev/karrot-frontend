<template>
  <div>
    <QBanner
      v-for="{ type, icon, className, action, message, html, context } in formattedBanners"
      :key="type"
      class="k-banner"
      style="min-height: unset"
      inline-actions
      :class="className"
    >
      <template v-if="html">
        <div class="html" v-html="html" />
      </template>
      <template v-else-if="message">
        {{ $t(message, context) }}
      </template>
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

import bannersAPI from '@/communityFeed/api/communityFeed'

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
  emits: [
    'agree',
    'reconnect',
  ],
  data () {
    return {
      communityBannerTopics: {},
    }
  },
  computed: {
    formattedBanners () {
      return this.banners.map(banner => {
        const formatted = this[banner.type](banner.context)
        if (!formatted) return null
        return {
          ...formatted,
          ...banner,
        }
      }).filter(banner => {
        return banner && (!banner.desktopOnly || !this.$q.platform.is.mobile)
      })
    },
  },
  async created () {
    const communityBanners = this.banners.filter(banner => banner.type === 'communityBanner')
    for (const banner of communityBanners) {
      try {
        const { topicId } = banner.context
        // TODO: would need to not fetch dismissed ones, and all this logic really belongs in the store
        this.communityBannerTopics[topicId] = await bannersAPI.getTopic(topicId)
      }
      catch (e) {
        console.error(e)
      }
    }
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

    communityBanner ({ topicId }) {
      const topic = this.communityBannerTopics[topicId]
      if (!topic) return null
      const post = topic.postStream.posts[0]
      return {
        className: 'bg-blue text-white',
        icon: 'fas fa-bullhorn',
        html: post.cooked,
        action: {
          label: 'Close',
          handler: () => this.$emit('blah'), // TODO: would have to mark it as read
        },
      }
    },
  },
}
</script>

<style lang="sass" scoped>
body.desktop .k-banner
  min-width: 500px

.k-banner ::v-deep(.q-banner__avatar)
  align-self: center

.html
  ::v-deep(img.emoji)
    width: 20px
    height: 20px
    vertical-align: middle
</style>
