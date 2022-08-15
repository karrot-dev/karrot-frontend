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
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="html"
          v-html="html"
        />
        <!-- eslint-enable vue/no-v-html -->
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

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import {
  QBanner,
  QIcon,
  QBtn, Platform,
} from 'quasar'

import { useBanners } from '@/alerts/services'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const banners = useBanners()

function reconnect () {
  store.dispatch('connectivity/reconnect')
}

function dismissBanner (id) {
  store.dispatch('communityFeed/dismissBanner', id)
}

const formattedBanners = computed(() => banners.value.map(banner => {
  switch (banner.type) {
    case 'playgroundGroupInfo': return {
      className: 'bg-secondary text-white',
      icon: 'fas fa-child',
      message: 'GROUP.PLAYGROUND_INFO',
      action: {
        label: t('GROUP.JOIN_ANOTHER_GROUP'),
        handler: () => router.push({ name: 'groupsGallery' }).catch(() => {}),
      },
    }

    case 'notConnected': return {
      className: 'bg-warning text-white',
      icon: 'report_problem',
      message: banner.context.reconnecting
        ? 'GLOBAL.RECONNECTING'
        : 'GLOBAL.OFFLINE_RECONNECT',
      action: banner.context.reconnecting
        ? null
        : ({
          icon: 'refresh',
          handler: () => reconnect(),
        }),
    }

    case 'updateAvailable': return {
      className: 'bg-blue text-white',
      icon: 'new_releases',
      message: 'UPDATE_AVAILABLE.DETAIL',
      action: {
        label: t('UPDATE_AVAILABLE.RELOAD'),
        handler: () => window.location.reload(),
      },
    }

    case 'communityBanner': return {
      className: 'bg-blue text-white',
      icon: 'fas fa-bullhorn',
      html: banner.context.html,
      action: {
        label: t('BUTTON.CLOSE'),
        handler: () => dismissBanner(banner.context.id),
      },
    }

    default: return null
  }
}).filter(banner => banner && (!banner.desktopOnly || !Platform.is.mobile)))
</script>

<style lang="sass" scoped>
body.desktop .k-banner
  min-width: 500px

.k-banner ::v-deep(.q-banner__avatar)
  align-self: center

.html
  ::v-deep(p:last-child)
    margin-bottom: 0

  ::v-deep(a)
    text-decoration: underline

  ::v-deep(img.emoji)
    width: 20px
    height: 20px
    vertical-align: middle
</style>
