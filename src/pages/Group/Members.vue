<template>
  <q-card
    class="no-mobile-margin no-shadow grey-border"
  >
    <RandomArt
      :seed="groupId"
      type="circles">
      <div class="art-overlay"/>
    </RandomArt>
    <div class="generic-padding actionButtons">
      <router-link :to="{name: 'groupInvitations', params: { groupId }}">
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
    <UserList
      class="padding-top"
      :users="users" />
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
      groupId: 'currentGroup/id',
    }),
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.actionButtons
  margin-top -36px
  float right
  .q-btn
    margin 3px

.padding-top
  padding-top 8px

body.mobile .art-overlay
  width 100%
  height 30px
  background linear-gradient(to bottom, rgba(0,0,0,$groupNavOverlay) 0%, rgba(0,0,0,0) 100%)
</style>
