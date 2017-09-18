<template>
  <q-list no-border link inset-separator>
    <q-list-header>General</q-list-header>
    <q-side-link item :to="{name: 'settings'}">
      <q-item-side><i class="fa fa-cog"/></q-item-side>
      <q-item-main label="Settings" />
    </q-side-link>
    <q-list-header>About us</q-list-header>
    <q-side-link item to="/chat">
      <q-item-side><i class="fa fa-newspaper-o"/></q-item-side>
      <q-item-main label="Blog" sublabel="All News around foodsaving.world" />
    </q-side-link>
    <q-side-link item to="/chat">
      <q-item-side><i class="fa fa-users"/></q-item-side>
      <q-item-main label="Team" sublabel="Our Contributors" />
    </q-side-link>
    <q-side-link item to="/chat">
      <q-item-side><i class="fa fa-git"/></q-item-side>
      <q-item-main label="Git" sublabel="See out code!" />
    </q-side-link>
  </q-list>
</template>
<script>

import { QList, QListHeader, QSideLink, QItemSide, QItemMain } from 'quasar'

export default {
  components: { QList, QListHeader, QSideLink, QItemSide, QItemMain },
}
</script>

<style scoped lang="stylus">
  .fa
    font-size 1.5em
</style>
