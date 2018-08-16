<template>
  <div class="list-wrapper">
    <q-list
      no-border
    >
      <q-item
        v-if="users.length > 15"
      >
        <q-search v-model="filterTerm" />
      </q-item>
      <q-list-header
        v-if="activeEditors.length > 0"
        class="row justify-end"
      >
        <span v-t="'USERDATA.TRUSTED_BY'" />
      </q-list-header>
      <UserItem
        v-for="user in activeEditors"
        :key="user.id"
        :user="user"
      />
      <q-list-header
        v-if="activeNewcomers.length > 0"
        class="row justify-between"
      >
        <span v-t="'USERDATA.NEWCOMER'" />
        <span v-t="'USERDATA.TRUSTED_BY'" />
      </q-list-header>
      <UserItem
        v-for="user in activeNewcomers"
        :key="user.id"
        :user="user"
      />
      <q-item-separator />
      <q-collapsible
        v-if="inactiveUsers.length > 0"
        icon="fas fa-bed"
        :label="$t('GROUP.INACTIVE')"
        :sublabel="inactiveSublabel"
        @show="showInactive = true"
        @hide="showInactive = false"
      >
        <template v-if="showInactive">
          <UserItem
            v-for="user in inactiveUsers"
            :key="user.id"
            :user="user"
            class="inactive"
          />
        </template>
      </q-collapsible>
    </q-list>
  </div>
</template>

<script>
import {
  QList,
  QListHeader,
  QItemSeparator,
  QItem,
  QCollapsible,
  QSearch,
} from 'quasar'

import UserItem from './UserItem'

export default {
  components: {
    UserItem,
    QList,
    QListHeader,
    QItemSeparator,
    QItem,
    QCollapsible,
    QSearch,
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
    sorting: {
      type: String,
      default: 'joinDate',
    },
  },
  data () {
    return {
      showInactive: false,
      filterTerm: '',
    }
  },
  methods: {
    sort (list) {
      const getJoinDate = a => a.membership.createdAt
      const sortByJoinDate = (a, b) => getJoinDate(b) - getJoinDate(a)
      const sortByName = (a, b) => a.displayName.localeCompare(b.displayName)
      return list.slice().sort(this.sorting === 'joinDate' ? sortByJoinDate : sortByName)
    },
    filterByTerms (list) {
      if (!this.filterTerm || this.filterTerm === '') return list
      return list.filter(u => u.displayName.toLowerCase().includes(this.filterTerm.toLowerCase()))
    },
  },
  computed: {
    inactiveSublabel () {
      return this.inactiveUsers.length + ' ' + this.$tc('JOINGROUP.NUM_MEMBERS', this.inactiveUsers.length)
    },
    activeUsers () {
      return this.sort(this.filterByTerms(this.users.filter(u => u.membership.active)))
    },
    activeEditors () {
      return this.activeUsers.filter(u => u.membership.isEditor)
    },
    activeNewcomers () {
      return this.activeUsers.filter(u => !u.membership.isEditor)
    },
    inactiveUsers () {
      return this.sort(this.filterByTerms(this.users.filter(u => !u.membership.active)))
    },
  },
}
</script>

<style scoped lang="stylus">
.list-wrapper
  .profilePic
    margin-right .5em
.inactive
  opacity 0.5
</style>
