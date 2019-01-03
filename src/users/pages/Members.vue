<template>
  <QCard class="no-mobile-margin no-shadow grey-border k-members">
    <RandomArt
      :seed="group.id"
      type="circles"
    />
    <div class="q-mx-md actionButtons">
      <QBtn
        small
        round
        color="secondary"
        :icon="sorting === 'joinDate' ? 'fas fa-sort-alpha-down' : 'fas fa-sort-numeric-down'"
        class="hoverScale"
        @click="toggleSorting"
      >
        <QTooltip v-t="sorting === 'joinDate' ? 'GROUP.SORT_NAME' : 'GROUP.SORT_JOINDATE'" />
      </QBtn>
      <RouterLink
        v-if="isEditor"
        :to="{name: 'groupInvitations', params: { groupId: group.id }}"
      >
        <QBtn
          small
          round
          color="secondary"
          icon="fas fa-user-plus"
          class="hoverScale"
        >
          <QTooltip v-t="'GROUP.INVITE_TITLE'" />
        </QBtn>
      </RouterLink>
    </div>
    <UserList
      class="q-pt-sm"
      :users="users"
      :group="group"
      :sorting="sorting"
      @createTrust="createTrust"
    />
  </QCard>
</template>

<script>
import { QCard, QBtn, QTooltip } from 'quasar'
import UserList from '@/users/components/UserList'
import RandomArt from '@/utils/components/RandomArt'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: { RandomArt, UserList, QCard, QBtn, QTooltip },
  data () {
    return {
      sorting: 'joinDate',
    }
  },
  methods: {
    ...mapActions({
      createTrust: 'currentGroup/trustUser',
    }),
    toggleSorting () {
      if (this.sorting === 'joinDate') {
        this.sorting = 'name'
      }
      else {
        this.sorting = 'joinDate'
      }
    },
  },
  computed: {
    ...mapGetters({
      users: 'users/byCurrentGroup',
      group: 'currentGroup/value',
      isEditor: 'currentGroup/isEditor',
    }),
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.k-members
  max-width 500px
  margin-left auto
  margin-right auto
.actionButtons
  margin-top -21px
  float right
  .q-btn
    margin-left 3px
</style>
