<template>
  <div>
    <h1>Home page!</h1>

    <pre>
      conversation: {{ conversation }}
    </pre>
    <button @click="foo()">foo</button>
    <button v-if="isLoggedIn" @click="logoutDo()">logout</button>
    <button v-else @click="loginDo()">login</button>
    <pre v-if="!isLoggedIn">NOT LOGGED IN</pre>
    <pre v-if="isLoggedIn">user: {{ user }}</pre>
    <div v-if="isFetching">Loading!</div>
    <div class="error" v-if="error">{{ error }}</div>
    <ul>
      <li v-for="group in groups">
        {{ group.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import store from '@/store'

export default {
  computed: {
    ...mapState({
      user: state => state.auth.user,
      groups: state => state.groups.entries,
      isFetching: state => state.groups.isFetching,
      error: state => state.groups.error
    }),
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn'
    }),
    conversation: () => store.getters['conversations/getById'](1)
  },
  methods: {
    ...mapActions({
      fetchGroups: 'groups/fetchGroups',
      check: 'auth/check',
      login: 'auth/login',
      logout: 'auth/logout',
      subscribe: 'conversations/subscribe'
    }),
    loginDo () {
      this.login({ email: 'foo@foo.com', password: 'foofoo' })
    },
    logoutDo () {
      this.logout()
    },
    foo () {
      this.subscribe({ conversationId: 1 })
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
