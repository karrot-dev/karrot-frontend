<template>
  <q-list
    no-border
    link
    inset-separator
  >
    <q-side-link
      item
      :to="{name: 'user', params: {userId: currentUserId}}"
    >
      <q-item-side>
        <i class="fa fa-user fa-fw"/>
      </q-item-side>
      <q-item-main :label="$t('TOPBAR.USERPROFILE')" />
    </q-side-link>

    <q-side-link
      item
      :to="{name: 'groupsGallery'}"
    >
      <q-item-side>
        <i class="fa fa-home fa-fw"/>
      </q-item-side>
      <q-item-main :label="$t('TOPBAR.CHANGE_GROUP')" />
    </q-side-link>

    <q-side-link
      item
      :to="{name: 'settings'}"
    >
      <q-item-side>
        <i class="fa fa-cog fa-fw"/>
      </q-item-side>
      <q-item-main :label="$t('SETTINGS.TITLE')" />
    </q-side-link>

    <q-item
      @click="$emit('logout'), $emit('toggleSidenav')"
    >
      <q-item-side>
        <i class="fa fa-sign-out fa-fw"/>
      </q-item-side>
      <q-item-main :label="$t('TOPBAR.LOGOUT')" />
    </q-item>

    <q-list-header>Info</q-list-header>
    <a
      class="q-item"
      target="_blanc"
      href="https://foodsaving.world"
    >
      <q-item-side>
        <i class="fa fa-users"/>
      </q-item-side>
      <q-item-main
        label="Info"
        :sublabel="$t('SIDENAV.INFO_SUB')"
      />
    </a>

    <a
      class="q-item"
      target="_blanc"
      href="https://blog.karrot.world"
    >
      <q-item-side>
        <i class="fa fa-newspaper-o"/>
      </q-item-side>
      <q-item-main
        label="Blog"
        :sublabel="$t('SIDENAV.BLOG_SUB')"
      />
    </a>

    <a
      class="q-item"
      target="_blanc"
      href="https://github.com/yunity/karrot-frontend"
    >
      <q-item-side>
        <i class="fa fa-git"/>
      </q-item-side>
      <q-item-main
        label="Git"
        :sublabel="$t('SIDENAV.GIT_SUB')"
      />
    </a>
    <q-item-separator />
    <LocaleSelect style="color: rgba(0,0,0,0.54)" />
  </q-list>
</template>
<script>

import { QList, QListHeader, QSideLink, QItem, QItemSeparator, QItemSide, QItemMain } from 'quasar'
import LocaleSelect from '@/components/General/LocaleSelect'

export default {
  components: { QList, QListHeader, QSideLink, QItem, QItemSeparator, QItemSide, QItemMain, LocaleSelect },
  props: {
    currentUserId: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style scoped lang="stylus">
  .fa
    font-size 1.5em
</style>
