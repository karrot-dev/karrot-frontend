<template>
  <div class="list-wrapper">
    <QList
      no-border
    >
      <QItem
        v-if="users.length > 15"
      >
        <QSearch v-model="filterTerm" />
      </QItem>
      <UserItem
        v-for="user in activeUsers"
        :key="user.id"
        :user="user"
        :group="group"
        @createTrust="$emit('createTrust', arguments[0])"
      />
      <QItemSeparator />
      <QCollapsible
        v-if="inactiveUsers.length > 0"
        @show="showInactive = true"
        @hide="showInactive = false"
      >
        <template slot="header">
          <QItemSide>
            <QItemTile icon="fas fa-bed" />
          </QItemSide>
          <QItemMain
            :label="$t('GROUP.INACTIVE')"
            :sublabel="inactiveSublabel"
          />
          <QItemSide>
            <QBtn
              flat
              round
              dense
              icon="help_outline"
              @click.stop="inactivityInfo"
            />
          </QItemSide>
        </template>

        <template v-if="showInactive">
          <UserItem
            v-for="user in inactiveUsers"
            :key="user.id"
            :user="user"
            :group="group"
            class="inactive"
            @createTrust="$emit('createTrust', arguments[0])"
          />
        </template>
      </QCollapsible>
    </QList>
  </div>
</template>

<script>
import {
  Dialog,
  QList,
  QItemSeparator,
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
  QCollapsible,
  QBtn,
  QSearch,
} from 'quasar'

import UserItem from './UserItem'

export default {
  components: {
    UserItem,
    QList,
    QItemSeparator,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QCollapsible,
    QBtn,
    QSearch,
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
    group: {
      type: Object,
      default: null,
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
  computed: {
    inactiveSublabel () {
      return this.inactiveUsers.length + ' ' + this.$tc('JOINGROUP.NUM_MEMBERS', this.inactiveUsers.length)
    },
    activeUsers () {
      return this.sort(this.filterByTerms(this.users.filter(u => u.membership.active)))
    },
    inactiveUsers () {
      return this.sort(this.filterByTerms(this.users.filter(u => !u.membership.active)))
    },
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
    inactivityInfo () {
      Dialog.create({
        title: this.$t('INACTIVITY.WHAT'),
        message: this.$t('INACTIVITY.HELP', { dayCount: this.group.memberInactiveAfterDays }),
        ok: this.$t('BUTTON.BACK'),
      })
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
