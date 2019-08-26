<template>
  <QCard class="no-mobile-margin no-shadow grey-border k-members">
    <div class="relative-position">
      <RandomArt
        :seed="groupId"
        type="circles"
      />
      <div class="q-mx-md actionButtons">
        <QBtn
          small
          round
          color="secondary"
          :icon="sorting === 'joinDate' ? 'fas fa-sort-alpha-down' : 'fas fa-sort-numeric-down'"
          :title="$t(sorting === 'joinDate' ? 'GROUP.SORT_NAME' : 'GROUP.SORT_JOINDATE')"
          @click="toggleSorting"
        />
        <RouterLink
          v-if="isEditor"
          :to="{name: 'groupInvitations', params: { groupId }}"
        >
          <QBtn
            small
            round
            color="secondary"
            icon="fas fa-user-plus"
            :title="$t('GROUP.INVITE_TITLE')"
          />
        </RouterLink>
      </div>
    </div>
    <KSpinner v-show="fetchStatus.pending" />
    <UserList
      class="q-pt-md"
      :users="users"
      :group="group"
      :sorting="sorting"
      @createTrust="createTrust"
    />
  </QCard>
</template>

<script>
import {
  QCard,
  QBtn,
} from 'quasar'
import UserList from '@/users/components/UserList'
import RandomArt from '@/utils/components/RandomArt'
import KSpinner from '@/utils/components/KSpinner'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: {
    RandomArt,
    UserList,
    KSpinner,
    QCard,
    QBtn,
  },
  data () {
    return {
      sorting: 'joinDate',
    }
  },
  computed: {
    ...mapGetters({
      users: 'users/byCurrentGroup',
      group: 'currentGroup/value',
      isEditor: 'currentGroup/isEditor',
      fetchStatus: 'users/fetchStatus',
    }),
    groupId () {
      return this.group && this.group.id
    },
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
}
</script>

<style scoped lang="stylus">
.k-members
  max-width 500px
  margin-left auto
  margin-right auto
.actionButtons
  position absolute
  right 5px
  bottom -20px
  .q-btn
    margin-left 3px
</style>
