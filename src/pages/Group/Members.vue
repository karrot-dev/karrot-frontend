<template>
  <div>
    <q-card
      class="no-padding no-shadow grey-border"
    >
      <div class="group-banner">
        <RandomArt
          :seed="group.id"
          type="circles" />
      </div>
      <div class="generic-padding">
        <div
          class="actionButtons"
          v-if="!$q.platform.is.mobile">
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
  </div>
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

.group-banner > span
    display: block
    height 5vw
    min-height 30px
    max-height 48px
    overflow hidden

body.mobile .group-banner
  border 0
  max-height: 30px
  overflow: hidden
</style>
