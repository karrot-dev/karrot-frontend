<template>
  <q-card
    class="no-mobile-margin no-padding no-shadow grey-border"
  >
    <RandomArt
      :seed="group.id"
      type="circles">
      <div style="margin: 0; padding: 10px; display: inline-block; color: white; background-color: rgba(0,0,0,.38)">
        <h1>Members</h1>
        This could be a very interesting text about members.
        This could be a very interesting text about members.
        This could be a very interesting text about members.
        This could be a very interesting text about members.
        This could be a very interesting text about members.
        This could be a very interesting text about members.
        This could be a very interesting text about members.
      </div>
    </RandomArt>
    <div class="generic-padding">
      <div class="actionButtons">
        <router-link :to="{name: 'groupInvitations', params: {groupId: group.id}}">
          <q-btn
            small
            round
            color="secondary"
            icon="fa-user-plus"
            class="hoverScale"
          >
            <q-tooltip v-t="'GROUP.INVITE_TITLE'" />
          </q-btn>
        </router-link>
      </div>
      <UserList :users="users" />
    </div>
  </q-card>
</template>

<script>
import { QCard, QBtn, QTooltip } from 'quasar'
import UserList from '@/components/ProfilePictures/UserList'
import RandomArt from '@/components/General/RandomArt'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { RandomArt, UserList, QCard, QBtn, QTooltip },
  computed: {
    ...mapGetters({
      users: 'users/byCurrentGroup',
      group: 'currentGroup/value',
    }),
  },
}
</script>

<style scoped lang="stylus">
.actionButtons
  margin-top -36px
  float right
  .q-btn
    margin 3px
</style>
