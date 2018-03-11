<template>
  <div class="list-wrapper">
    <q-list
      highlight
      no-border
    >
      <q-item
        v-for="user in activeUsers"
        :key="user.id"
        link
        :to="{name: 'user', params: { userId: user.id }}"
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
      </q-item>
      <q-item-separator />
      <q-collapsible
        v-if="inactiveUsers.length > 0"
        icon="fa-bed"
        :label="$t('GROUP.INACTIVE')"
        :sublabel="inactiveSublabel"
      >
        <q-item
          v-for="user in inactiveUsers"
          :key="user.id"
          link
          :to="{name: 'user', params: { userId: user.id }}"
          class="inactive"
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
        </q-item>
      </q-collapsible>
    </q-list>
  </div>
</template>

<script>

import { QList, QItemSeparator, QItem, QItemMain, QItemTile, QItemSide, QCollapsible } from 'quasar'
import ProfilePicture from './ProfilePicture'

export default {
  components: { ProfilePicture, QList, QItemSeparator, QItem, QItemMain, QItemTile, QItemSide, QCollapsible },
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  computed: {
    inactiveSublabel () {
      return this.inactiveUsers.length + ' ' + this.$tc('JOINGROUP.NUM_MEMBERS', this.inactiveUsers.length)
    },
    activeUsers () {
      return this.users.filter(u => u.membershipInCurrentGroup.active)
    },
    inactiveUsers () {
      return this.users.filter(u => !u.membershipInCurrentGroup.active)
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
