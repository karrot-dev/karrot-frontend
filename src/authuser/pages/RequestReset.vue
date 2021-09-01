<template>
  <RequestPasswordReset
    :status="$store.getters['users/requestResetPasswordStatus']"
    @submit="data => $store.dispatch('users/requestResetPassword', data)"
  />
</template>

<script>
import RequestPasswordReset from '@/authuser/components/RequestPasswordReset'

export default {
  components: {
    RequestPasswordReset,
  },
}
</script>
