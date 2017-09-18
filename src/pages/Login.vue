<template>
    <div>
      <Login @loginDo="loginDo" :error="error"/>
    </div>
</template>

<script>
import Login from '@/components/Login/Login.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Login,
  },
  computed: {
    ...mapGetters({
      error: 'auth/error',
    }),
  },
  methods: {
    ...mapActions({
      login: 'auth/login',
    }),
    loginDo (email, password) {
      this.login({ email, password })
    },
  },
  metaInfo () {
    return {
      title: this.$t('LOGIN.TITLE'),
    }
  },
}
</script>

<style scoped lang="stylus">
</style>
