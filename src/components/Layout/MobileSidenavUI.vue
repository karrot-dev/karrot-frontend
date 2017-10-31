<template>
  <q-list no-border link inset-separator>
    <q-list-header>General</q-list-header>
    <q-side-link item :to="{name: 'user', params: {userId: currentUserId}}">
      <q-item-side><i class="fa fa-user fa-fw"/></q-item-side>
      <q-item-main :label="$t('TOPBAR.USERPROFILE')" />
    </q-side-link>
    <q-side-link item :to="{name: 'groupsGallery'}">
      <q-item-side><i class="fa fa-home fa-fw"/></q-item-side>
      <q-item-main :label="$t('TOPBAR.CHANGE_GROUP')" />
    </q-side-link>
    <q-side-link item :to="{name: 'settings'}">
      <q-item-side><i class="fa fa-cog fa-fw"/></q-item-side>
      <q-item-main :label="$t('SETTINGS.TITLE')" />
    </q-side-link>
    <q-item  @click="$emit('logout'), $emit('toggleSidenav')">
      <q-item-side><i class="fa fa-sign-out fa-fw"/></q-item-side>
      <q-item-main :label="$t('TOPBAR.LOGOUT')" />
    </q-item>
    <q-list-header>About us</q-list-header>
    <a class="q-item" target="_blanc" href="https://blog.foodsaving.world">
      <q-item-side><i class="fa fa-newspaper-o"/></q-item-side>
      <q-item-main label="Blog" sublabel="All News around foodsaving.world" />
    </a>
    <a class="q-item" target="_blanc" href="https://blog.foodsaving.world/team.en.html">
      <q-item-side><i class="fa fa-users"/></q-item-side>
      <q-item-main label="Team" sublabel="Our Team" />
    </a>
    <a class="q-item" target="_blanc" href="https://github.com/yunity/karrot-frontend">
      <q-item-side><i class="fa fa-git"/></q-item-side>
      <q-item-main label="Git" sublabel="See our code!" />
    </a>
  </q-list>
</template>
<script>

import { QList, QListHeader, QSideLink, QItem, QItemSide, QItemMain } from 'quasar'

export default {
  components: { QList, QListHeader, QSideLink, QItem, QItemSide, QItemMain },
  props: {
    currentUserId: { required: true },
  },
}
</script>

<style scoped lang="stylus">
  .fa
    font-size 1.5em
</style>
