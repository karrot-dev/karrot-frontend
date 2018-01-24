<template>
  <q-toolbar color="primary">
    <slot />
    <router-link
      :to="{name: 'group'}"
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
    <q-transition
      duration="310"
      name="search-slide-in"
      appear
    >
      <div
        class="searchbar row no-wrap"
        v-if="searchOpen"
      >
        <q-btn
          flat
          small
          color="primary"
          @click="$emit('hideSearch')"
        >
          <q-icon name="fa-fw fa-arrow-right"/>
        </q-btn>
        <div>
          <Search style="margin-top: .2em; vertical-align: middle"/>
        </div>
      </div>
    </q-transition>
    <q-btn
      v-if="!searchOpen"
      flat
      @click="$emit('showSearch')"
    >
      <q-icon name="fa-fw fa-search" />
      <q-tooltip v-t="'BUTTON.SEARCH'" />
    </q-btn>
    <template v-if="!$q.platform.is.mobile">
      <q-btn flat>
        <q-icon name="fa-fw fa-comments" />
        <q-tooltip v-t="'CHAT.TITLE'" />
        <q-popover
          :touch-position="false"
          ref="chatpopover"
          class="chat-popover"
        >
          <div class="content">
            <ChatList :show-expand="true"/>
          </div>
        </q-popover>
      </q-btn>
      <LocaleSelect />
      <router-link
        :to="{name: 'user', params: {userId: user.id}}"
        class="defaulthover"
      >
        <q-btn
          v-if="hasPhoto"
          flat
        >
          <div class="row items-center no-wrap">
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
        >
          {{ user.displayName }}
          <q-icon name="fa-fw fa-user" />
          <q-tooltip v-t="'TOPBAR.USERPROFILE'" />
        </q-btn>
      </router-link>
      <q-btn flat>
        <q-icon name="fa-fw fa-ellipsis-v" />
        <q-tooltip v-t="'BUTTON.MORE_OPTIONS'" />
        <q-popover
          :touch-position="false"
          fit
          ref="popover"
          anchor="bottom right"
          self="top right"
        >
          <q-list
            item-separator
            link
          >
            <q-item
              :to="{name: 'groupsGallery'}"
              @click.native="$refs.popover.close()"
            >
              <q-icon
                size="1em"
                class="on-left"
                name="fa-home fa-fw"
              />
              {{ $t('TOPBAR.CHANGE_GROUP') }}
            </q-item>
            <q-item
              :to="{name: 'settings'}"
              @click.native="$refs.popover.close()"
            >
              <q-icon
                size="1em"
                class="on-left"
                name="fa-cog fa-fw"
              />
              {{ $t('SETTINGS.TITLE') }}
            </q-item>
            <q-item
              @click="$emit('logout'), $refs.popover.close()"
            >
              <q-icon
                size="1em"
                class="on-left"
                name="fa-sign-out fa-fw"
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
import { QTransition, QToolbar, QToolbarTitle, QBtn, QIcon, QPopover, QList, QItem, QTooltip } from 'quasar'
import KarrotLogo from './KarrotLogo'
import KBreadcrumb from '@/components/General/KBreadcrumb'
import Search from '@/components/General/Search'
import LocaleSelect from '@/components/General/LocaleSelect'
import ChatList from '@/components/Conversation/ChatList'

export default {
  components: {
    QTransition, ChatList, QToolbar, QToolbarTitle, QBtn, QIcon, QPopover, QList, QItem, QTooltip, KarrotLogo, KBreadcrumb, Search, LocaleSelect,
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
.searchbar
  background-color lightgrey
  padding-right .2em
  margin-right .2em
  border-radius $borderRadiusSmall
.chat-popover
  max-width 450px
  background none
  overflow-y hidden
.chat-popover .content
  margin-top 10px
  background white
  overflow-y auto
.chat-popover:before
    position: absolute;
    z-index: 6000;
    content: '';
    right: 8px;
    top: 0px;
    border-style: solid;
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent $neutral transparent;

.search-slide-in-leave, .search-slide-in-enter-to
  width: 17em

.search-slide-in-leave-active, .search-slide-in-enter-active
  transition: all .3s ease

.search-slide-in-enter, .search-slide-in-leave-to
  width: 0em
  opacity 0

a.defaulthover:hover {
  color: inherit
}
</style>
