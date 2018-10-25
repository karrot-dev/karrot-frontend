<template>
  <q-toolbar :color="connected ? 'primary' : 'grey-8'">
    <slot />
    <router-link
      :to="'/'"
      v-if="!$q.platform.is.mobile"
      class="logo"
    >
      <KarrotLogo/>
    </router-link>
    <q-toolbar-title>
      <div class="row justify-between no-wrap">
        <div/>
        <KBreadcrumb
          class="bread"
          :breadcrumbs="breadcrumbs"
        />
        <div/>
      </div>
    </q-toolbar-title>
    <div
      class="k-searchbar row no-wrap"
      v-if="searchOpen"
    >
      <Search @clear="$emit('hideSearch')" />
    </div>
    <q-btn
      v-show="!searchOpen"
      flat
      dense
      round
      @click="$emit('showSearch')"
    >
      <q-icon name="fas fa-fw fa-search" />
      <q-tooltip v-t="'BUTTON.SEARCH'" />
    </q-btn>
    <template v-if="!$q.platform.is.mobile">
      <CommunityFeed />
      <LatestMessageButton />
      <NotificationButton />
      <LocaleSelect />
      <router-link
        :to="{name: 'user', params: {userId: user.id}}"
      >
        <q-btn
          v-if="hasPhoto"
          flat
          dense
        >
          <div class="row items-center no-wrap">
            <q-icon
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
          <q-tooltip v-t="'TOPBAR.USERPROFILE'" />
        </q-btn>
        <q-btn
          v-else
          flat
          dense
        >
          <q-icon
            :name="presence.icon"
            :color="presence.color"
            class="presence-indicator"
          />
          {{ user.displayName }}
          <q-icon name="fas fa-fw fa-user" />
          <q-tooltip v-t="'TOPBAR.USERPROFILE'" />
        </q-btn>
      </router-link>
      <q-btn
        flat
        dense
        round
      >
        <q-icon name="fas fa-ellipsis-v" />
        <q-popover
          :touch-position="false"
          fit
          anchor="bottom right"
          self="top right"
        >
          <q-list
            item-separator
            link
            v-close-overlay
          >
            <q-item
              :to="{name: 'groupsGallery'}"
            >
              <q-icon
                size="1em"
                class="on-left"
                name="fas fa-home fa-fw"
              />
              {{ $t('TOPBAR.CHANGE_GROUP') }}
            </q-item>
            <q-item
              :to="{name: 'settings'}"
            >
              <q-icon
                size="1em"
                class="on-left"
                name="fas fa-cog fa-fw"
              />
              {{ $t('SETTINGS.TITLE') }}
            </q-item>
            <q-item
              @click.native="$emit('logout')"
            >
              <q-icon
                size="1em"
                class="on-left"
                name="fas fa-sign-out-alt fa-fw"
              />
              {{ $t('TOPBAR.LOGOUT') }}
            </q-item>
          </q-list>
        </q-popover>
      </q-btn>
    </template>
  </q-toolbar>
</template>

<script>
import {
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QChip,
  QPopover,
  QList,
  QItem,
  QTooltip,
} from 'quasar'
import KarrotLogo from '../../utils/components/KarrotLogo'
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
    QChip,
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
