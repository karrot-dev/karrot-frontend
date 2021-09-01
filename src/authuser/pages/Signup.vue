<template>
  <Signup
    :status="$store.getters['auth/signupStatus']"
    :prefill-email="$store.getters['route/query'].email"
    @submit="data => $store.dispatch('users/signup')"
  />
</template>

<script>
import Signup from '@/authuser/components/Signup'

export default {
  components: {
    Signup,
  },
}
</script>
