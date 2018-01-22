<template>
  <div class="list-wrapper">
    <q-list
      highlight
      no-border
    >
      <q-item
        link
        :to="{name: 'user', params: { userId: user.id }}"
        v-for="user in users"
        :key="user.id"
        class="list-item"
      >

        <q-item-side right>
          <ProfilePicture
            :key="user.id"
            :user="user"
            :size="30"
            class="profilePic"
          />
        </q-item-side>
        <q-item-main>
          <q-item-tile label>
            {{ user.displayName }}
          </q-item-tile>
        </q-item-main>
        <q-item-side
          class="right-item"
          right>
          <router-link :to="{name: 'chatDetail', params: {userId: user.id}}">
            <q-btn
              flat
              small>
              <i class="fa fa-comment" />
            </q-btn>
          </router-link>
        </q-item-side>
      </q-item>
    </q-list>
  </div>
</template>

<script>

import { QBtn, QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide } from 'quasar'
import ProfilePicture from './ProfilePicture'

export default {
  components: { ProfilePicture, QBtn, QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide },
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped lang="stylus">
.list-wrapper
  margin .3em
  .profilePic
    margin-right .5em
body.desktop .list-item .right-item
    display none
body.desktop .list-item:hover .right-item
    display inline-block
</style>
