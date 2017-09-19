<template>
  <div class="wrapper">
    <q-list highlight no-border>
      <q-item link :to="{name: 'user', params: { userId: user.id }}" v-for="user in users" :key="user.id">
        
        <q-item-side right>
          <ProfilePicture
            :key="user.id"
            :user="user"
            class="profilePic"/>
        </q-item-side>
        <q-item-main>
          <q-item-tile label>{{ user.displayName }}</q-item-tile>
        </q-item-main>
        <!--<q-item-side right>
          <q-item-tile><i class="fa fa-pencil"/></q-item-tile>
        </q-item-side>-->
      </q-item>
    </q-list>
  </div>
</template>

<script>

import { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide } from 'quasar'
import ProfilePicture from './ProfilePicture.vue'

export default {
  components: { ProfilePicture, QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide },
  props: {
    users: {
      required: true,
    },
  },
}
</script>

<style scoped lang="stylus">
.wrapper
  margin .3em
  .profilePic
    margin-right .5em
</style>