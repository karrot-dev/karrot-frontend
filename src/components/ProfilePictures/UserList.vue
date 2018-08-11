<template>
  <div class="list-wrapper">
    <q-list
      no-border
    >
      <q-item
        v-if="memberships.length > 15"
      >
        <q-search v-model="filterTerm" />
      </q-item>
      <q-list-header
        v-if="activeEditors.length > 0"
        class="row justify-between"
      >
        <span>Editors</span>
        <span>Trusted by</span>
      </q-list-header>
      <UserItem
        v-for="membership in activeEditors"
        :key="membership.user.id"
        :membership="membership"
      />
      <q-list-header
        v-if="activeNewcomers.length > 0"
        class="row justify-between"
      >
        <span>Newcomers</span>
        <span>Trusted by</span>
      </q-list-header>
      <UserItem
        v-for="membership in activeNewcomers"
        :key="membership.user.id"
        :membership="membership"
      />
      <q-item-separator />
      <q-collapsible
        v-if="inactiveMemberships.length > 0"
        icon="fas fa-bed"
        :label="$t('GROUP.INACTIVE')"
        :sublabel="inactiveSublabel"
        @show="showInactive = true"
        @hide="showInactive = false"
      >
        <template v-if="showInactive">
          <UserItem
            v-for="membership in inactiveMemberships"
            :key="membership.user.id"
            :membership="membership"
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
    memberships: {
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
      const sortByJoinDate = (a, b) => b.createdAt - a.createdAt
      const sortByName = (a, b) => a.user.displayName.localeCompare(b.user.displayName)
      return list.slice().sort(this.sorting === 'joinDate' ? sortByJoinDate : sortByName)
    },
    filterByTerms (list) {
      if (!this.filterTerm || this.filterTerm === '') return list
      return list.filter(m => m.user.displayName.toLowerCase().includes(this.filterTerm.toLowerCase()))
    },
  },
  computed: {
    inactiveSublabel () {
      return this.inactiveMemberships.length + ' ' + this.$tc('JOINGROUP.NUM_MEMBERS', this.inactiveMemberships.length)
    },
    activeMemberships () {
      return this.sort(this.filterByTerms(this.memberships.filter(m => m.active)))
    },
    activeEditors () {
      return this.activeMemberships.filter(m => m.isEditor)
    },
    activeNewcomers () {
      return this.activeMemberships.filter(m => !m.isEditor)
    },
    inactiveMemberships () {
      return this.sort(this.filterByTerms(this.memberships.filter(m => !m.active)))
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
