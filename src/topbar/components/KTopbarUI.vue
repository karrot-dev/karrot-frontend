<template>
  <QToolbar :color="connected ? 'primary' : 'grey-8'">
    <slot />
    <RouterLink
      :to="'/'"
      v-if="!$q.platform.is.mobile"
      class="logo"
    >
      <img
        v-if="currentGroup && currentGroup.hasPhoto"
        :src="currentGroup.photoUrls.thumbnail"
        style="height: 95%"
      >
      <KarrotLogo v-else />
    </RouterLink>
    <QToolbarTitle>
      <div class="row justify-between no-wrap">
        <div/>
        <KBreadcrumb
          class="bread"
          :breadcrumbs="breadcrumbs"
        />
        <div/>
      </div>
    </QToolbarTitle>
    <div
      class="k-searchbar row no-wrap"
      v-if="searchOpen"
    >
      <Search @clear="$emit('hideSearch')" />
    </div>
    <QBtn
      v-show="!searchOpen"
      flat
      dense
      round
      @click="$emit('showSearch')"
    >
      <QIcon name="fas fa-fw fa-search" />
      <QTooltip v-t="'BUTTON.SEARCH'" />
    </QBtn>
    <template v-if="!$q.platform.is.mobile">
      <CommunityFeed />
      <LatestMessageButton />
      <NotificationButton />
      <LocaleSelect />
      <RouterLink
        :to="{name: 'user', params: {userId: user.id}}"
      >
        <QBtn
          v-if="hasPhoto"
          flat
          dense
        >
          <div class="row items-center no-wrap">
            <QIcon
              :name="presence.icon"
              :color="presence.color"
              class="presence-indicator"
            />
            <span>{{ user.displayName }}</span>
            <img
              :src="photo"
              class="profilePicture"
            >
          </div>
          <QTooltip v-t="'TOPBAR.USERPROFILE'" />
        </QBtn>
        <QBtn
          v-else
          flat
          dense
        >
          <QIcon
            :name="presence.icon"
            :color="presence.color"
            class="presence-indicator"
          />
          {{ user.displayName }}
          <QIcon name="fas fa-fw fa-user" />
          <QTooltip v-t="'TOPBAR.USERPROFILE'" />
        </QBtn>
      </RouterLink>
      <QBtn
        flat
        dense
        round
      >
        <QIcon name="fas fa-ellipsis-v" />
        <QPopover
          :touch-position="false"
          fit
          anchor="bottom right"
          self="top right"
        >
          <QList
            item-separator
            link
            v-close-overlay
          >
            <QItem
              :to="{name: 'groupsGallery'}"
            >
              <QIcon
                size="1em"
                class="on-left"
                name="fas fa-home fa-fw"
              />
              {{ $t('TOPBAR.CHANGE_GROUP') }}
            </QItem>
            <QItem
              :to="{name: 'settings'}"
            >
              <QIcon
                size="1em"
                class="on-left"
                name="fas fa-cog fa-fw"
              />
              {{ $t('SETTINGS.TITLE') }}
            </QItem>
            <QItem
              @click.native="$emit('logout')"
            >
              <QIcon
                size="1em"
                class="on-left"
                name="fas fa-sign-out-alt fa-fw"
              />
              {{ $t('TOPBAR.LOGOUT') }}
            </QItem>
          </QList>
        </QPopover>
      </QBtn>
    </template>
  </QToolbar>
</template>

<script>
import {
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QPopover,
  QList,
  QItem,
  QTooltip,
} from 'quasar'
import KarrotLogo from '@/logo/components/KarrotLogo'
import KBreadcrumb from '@/topbar/components/KBreadcrumb'
import Search from '@/topbar/components/Search'
import LocaleSelect from '@/utils/components/LocaleSelect'
import CommunityFeed from '@/communityFeed/components/CommunityFeed'
import LatestMessageButton from '@/messages/components/LatestMessageButton'
import NotificationButton from '@/notifications/components/NotificationButton'

export default {
  components: {
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QPopover,
    QList,
    QItem,
    QTooltip,
    KarrotLogo,
    KBreadcrumb,
    Search,
    LocaleSelect,
    CommunityFeed,
    LatestMessageButton,
    NotificationButton,
  },
  props: {
    currentGroup: {
      default: null,
      type: Object,
    },
    breadcrumbs: {
      type: Array,
      required: false,
      default: () => [],
    },
    searchOpen: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    away: {
      type: Boolean,
      default: true,
    },
    connected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasPhoto () {
      return !!this.photo
    },
    photo () {
      if (this.user && this.user.photoUrls) {
        return this.user.photoUrls.thumbnail
      }
    },
    presence () {
      if (this.away) {
        return {
          color: 'grey',
          icon: 'fas fa-circle',
        }
      }
      return {
        color: 'secondary',
        icon: 'fas fa-circle',
      }
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.logo
  margin-left 1em
  height 36px
.profilePicture
  margin-left 1em
  height 36px

.k-searchbar
  background-color lightgrey
  min-width 251px
  max-width 251px
.presence-indicator
  margin-right .3em
  font-size 100%
</style>
