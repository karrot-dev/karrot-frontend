<template>
  <div>
    <h1>Home page!</h1>
    <p>{{ $t('GLOBAL.DEVMAIL_NOTE') }}</p>
    <select v-model="locale">
      <option v-for="locale in locales" :value="locale.locale">
        {{ locale.name }}
      </option>
    </select>
    <button @click="foo()">foo</button>
    <button v-if="isLoggedIn" @click="logoutDo()">{{ $t('TOPBAR.LOGOUT') }}</button>
    <button v-else @click="loginDo()">{{ $t('LOGIN.SUBMIT') }}</button>
    <pre v-if="!isLoggedIn">NOT LOGGED IN</pre>
    <pre v-if="isLoggedIn">user: {{ user }}</pre>
    <div v-if="isFetching">Loading!</div>
    <div class="error" v-if="error">{{ error }}</div>
    <ul>
      <li v-for="group in groups">
        <strong v-if="groupId === group.id">
          {{ group.name }}
        </strong>
        <span v-else>
          {{ group.name }}
        </span>
        <button v-if="isGroupMember(group.id, userId)" @click="leaveDo(group.id)">leave</button>
        <button v-else @click="joinDo(group.id)">join</button>
        <button v-if="isGroupMember(group.id, userId)" :disabled="groupId === group.id" @click="select(group.id)">select</button>
      </li>
    </ul>
    <pre>
      groupId: {{ groupId }}
    </pre>
    <ul>
      <li v-for="pickup in pickups">
        {{ pickup.date }}
        <button v-if="isPickupCollector(pickup.id, userId)" @click="leavePickupDo(pickup.id)">leave</button>
        <button v-else @click="joinPickupDo(pickup.id)">join</button>
      </li>
    </ul>
    <pre>
      conversation: {{ conversation }}
    </pre>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import store from '@/store'
import log from '@/services/log'
import { locales } from '@/i18n'

export default {
  data () {
    return {
      groupId: null,
      locales
    }
  },
  watch: {
    groupId (val) {
      this.fetchListByGroupId({ groupId: val })
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      groups: state => state.groups.entries,
      isFetching: state => state.groups.isFetching,
      error: state => state.groups.error,
      pickups: state => state.pickups.entries
    }),
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      userId: 'auth/userId'
    }),
    conversation: () => store.getters['conversations/getById'](1),
    locale: {
      get () {
        return store.state.i18n.locale
      },
      set (locale) {
        this.setLocale({ locale })
      }
    }
  },
  methods: {
    ...mapActions({
      fetchGroups: 'groups/fetchGroups',
      groups: 'groups/join',
      check: 'auth/check',
      login: 'auth/login',
      logout: 'auth/logout',
      subscribe: 'conversations/subscribe',
      join: 'groups/join',
      leave: 'groups/leave',
      fetchListByGroupId: 'pickups/fetchListByGroupId',
      joinPickup: 'pickups/join',
      leavePickup: 'pickups/leave',
      setLocale: 'i18n/setLocale'
    }),
    isGroupMember (groupId, userId) {
      return store.getters['groups/isMember'](groupId, userId)
    },
    isPickupCollector (pickupId, userId) {
      return store.getters['pickups/isCollector'](pickupId, userId)
    },
    loginDo () {
      this.login({ email: 'foo@foo.com', password: 'foofoo' })
    },
    logoutDo () {
      this.logout()
    },
    foo () {
      this.subscribe({ conversationId: 1 })
    },
    joinDo (groupId) {
      log.debug('joining', groupId)
      this.join({ groupId })
    },
    leaveDo (groupId) {
      log.debug('leaving', groupId)
      this.leave({ groupId })
    },
    select (groupId) {
      this.groupId = groupId
    },
    joinPickupDo (pickupId) {
      this.joinPickup({ pickupId })
    },
    leavePickupDo (pickupId) {
      this.leavePickup({ pickupId })
    }
  },
  mounted () {
    this.check()
    this.fetchGroups()
  }
}
</script>

<style lang="stylus">
.error
  color: red
  font-weight: bold
</style>
