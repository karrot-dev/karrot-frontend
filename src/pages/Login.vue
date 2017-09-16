<template>
  <SplashLayout>
    <div>
      <Login @loginDo="loginDo" :error="error"/>
    </div>
  </SplashLayout>
</template>

<script>
import SplashLayout from '@/components/LayoutDesktop/SplashLayout.vue'
import Login from '@/components/Login/Login.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    SplashLayout, Login
  },
  computed: {
    ...mapGetters({
      error: 'auth/error'
    })
  },
  methods: {
    ...mapActions({
      login: 'auth/login'
    }),
    loginDo (email, password) {
      this.login({ email, password })
    }
  },
  metaInfo () {
    return {
      title: 'test' // '$t("LOGIN.TITLE")'
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
