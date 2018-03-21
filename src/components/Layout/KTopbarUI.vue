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
    <transition
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
        <Search style="margin-top: .2em; vertical-align: middle; width: 100%"/>
      </div>
    </transition>
    <q-btn
      v-if="!searchOpen"
      flat
      @click="$emit('showSearch')"
    >
      <q-icon name="fa-fw fa-search" />
      <q-tooltip v-t="'BUTTON.SEARCH'" />
    </q-btn>
    <template v-if="!$q.platform.is.mobile">
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
        >
          <q-icon
            :name="presence.icon"
            :color="presence.color"
            class="presence-indicator"
          />
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
import { QToolbar, QToolbarTitle, QBtn, QIcon, QPopover, QList, QItem, QTooltip } from 'quasar'
import KarrotLogo from './KarrotLogo'
import KBreadcrumb from '@/components/General/KBreadcrumb'
import Search from '@/components/General/Search'
import LocaleSelect from '@/components/General/LocaleSelect'

export default {
  components: {
    QToolbar, QToolbarTitle, QBtn, QIcon, QPopover, QList, QItem, QTooltip, KarrotLogo, KBreadcrumb, Search, LocaleSelect,
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
          icon: 'fa-circle-o',
        }
      }
      return {
        color: 'green',
        icon: 'fa-circle',
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
  width: 100%
  min-width: 200px
  max-width: 400px
.presence-indicator
  margin-right .3em
  font-size 100%

/* Enter and leave animations can use different */
/* durations and timing functions.              */

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
