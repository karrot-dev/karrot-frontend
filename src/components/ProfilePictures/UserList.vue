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
          <q-item-tile sublabel>
            <div class="row">{{ $t('HISTORY.GROUP_JOIN') }}&nbsp;<DateAsWords :date="user.joinedAt" /></div>
          </q-item-tile>
        </q-item-main>
        <q-item-side left>
          <span
            v-for="role in user.rolesInGroup"
            :key="role"
          >
            {{ role }}
          </span>
        </q-item-side>
      </q-item>
    </q-list>
  </div>
</template>

<script>

import { QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide } from 'quasar'
import ProfilePicture from './ProfilePicture'
import DateAsWords from '@/components/General/DateAsWords'

export default {
  components: { ProfilePicture, QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide, DateAsWords },
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
</style>
