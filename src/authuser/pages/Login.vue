<template>
  <Login
    :status="$store.getters['auth/loginStatus']"
    @submit="data => $store.dispatch('auth/login', data)"
  />
</template>

<script>
import Login from '@/authuser/components/Login'

export default {
  components: {
    Login,
  },
}
</script>
