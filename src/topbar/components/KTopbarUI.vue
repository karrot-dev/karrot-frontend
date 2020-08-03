<template>
  <QToolbar
    class="text-white row justify-between"
    :class="connected ? 'bg-primary' : 'bg-grey-8'"
  >
    <slot />
    <QBtn
      v-if="!$q.platform.is.mobile"
      flat
    >
      <div class="logo">
        <img
          v-if="currentGroup && currentGroup.hasPhoto"
          :src="currentGroup.photoUrls.thumbnail"
          style="height: 95%"
        >
        <KarrotLogo
          v-else
          show-loading
        />
      </div>
      <QMenu>
        <QList>
          <QItem
            v-for="group in myGroups"
            :key="group.id"
            v-close-popup
            :to="{ name: 'group', params: { groupId: group.id } }"
            clickable
          >
            <QItemSection
              avatar
              class="groups"
            >
              <img
                v-if="group.hasPhoto"
                :src="group.photoUrls.thumbnail"
              >
              <QIcon
                v-else
                name="fas fa-users"
                class="groups"
              />
            </QItemSection>
            <QItemSection>
              {{ group.name }}
            </QItemSection>
          </QItem>
          <QItem
            :to="{name: 'groupsGallery'}"
          >
            <QItemSection avatar>
              <QIcon
                name="fas fa-globe"
                class="groups"
              />
            </QItemSection>
            <QItemSection>
              {{ $t('TOPBAR.SHOW_ALL_GROUPS') }}
            </QItemSection>
          </QItem>
        </QList>
      </QMenu>
    </QBtn>
    <QToolbarTitle class="no-wrap text-center">
      <KBreadcrumb
        class="bread"
        :breadcrumbs="breadcrumbs"
      />
    </QToolbarTitle>
    <div class="row no-wrap items-center">
      <div
        v-if="searchOpen"
        class="k-searchbar row no-wrap"
      >
        <Search @clear="$emit('hideSearch')" />
      </div>
      <QBtn
        v-show="!searchOpen"
        flat
        dense
        round
        icon="fas fa-fw fa-search"
        class="k-search-button"
        :title="$t('BUTTON.SEARCH')"
        @click="$emit('showSearch')"
      />
      <template v-if="!$q.platform.is.mobile">
        <LatestMessageButton />
        <NotificationButton />
        <RouterLink
          :to="{name: 'user', params: {userId: user.id}}"
          class="q-ml-xs"
        >
          <QBtn
            v-if="hasPhoto"
            flat
            dense
            :title="$t('TOPBAR.USERPROFILE')"
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
          </QBtn>
          <QBtn
            v-else
            flat
            dense
            :title="$t('TOPBAR.USERPROFILE')"
          >
            <QIcon
              :name="presence.icon"
              :color="presence.color"
              class="presence-indicator"
            />
            {{ user.displayName }}
            <QIcon name="fas fa-fw fa-user" />
          </QBtn>
        </RouterLink>
        <QBtn
          flat
          dense
          round
          class="k-more-options"
        >
          <QIcon name="fas fa-ellipsis-v" />
          <QMenu
            anchor="bottom right"
            self="top right"
          >
            <QList
              v-close-popup
              dense
            >
              <QItem
                :to="{name: 'settings'}"
              >
                <QItemSection side>
                  <QIcon
                    size="1em"
                    name="fas fa-cog fa-fw"
                  />
                </QItemSection>
                <QItemSection>
                  {{ $t('SETTINGS.TITLE') }}
                </QItemSection>
              </QItem>
              <QItem
                clickable
                @click="$emit('logout')"
              >
                <QItemSection side>
                  <QIcon
                    size="1em"
                    name="fas fa-sign-out-alt fa-fw"
                  />
                </QItemSection>
                <QItemSection>
                  {{ $t('TOPBAR.LOGOUT') }}
                </QItemSection>
              </QItem>
            </QList>
          </QMenu>
        </QBtn>
      </template>
    </div>
  </QToolbar>
</template>

<script>
import {
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QMenu,
  QList,
  QItem,
  QItemSection,
} from 'quasar'
import KarrotLogo from '@/logo/components/KarrotLogo'
import KBreadcrumb from '@/topbar/components/KBreadcrumb'
import Search from '@/topbar/components/Search'
import LatestMessageButton from '@/messages/components/LatestMessageButton'
import NotificationButton from '@/notifications/components/NotificationButton'

export default {
  components: {
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QMenu,
    QList,
    QItem,
    QItemSection,
    KarrotLogo,
    KBreadcrumb,
    Search,
    LatestMessageButton,
    NotificationButton,
  },
  props: {
    currentGroup: {
      default: null,
      type: Object,
    },
    myGroups: {
      type: Array,
      required: false,
      default: () => [],
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
      return null
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
  height 36px

.groups
  width 36px
  height 36px

.profilePicture
  height 36px
  margin-left 1em

.k-search-button, .k-more-options
  opacity $topbar-opacity-low

  &:hover
    opacity 1

.q-btn >>> .q-icon
  font-size 20px

.presence-indicator
  margin-right .3em
  font-size 12px !important
</style>
