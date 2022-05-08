<template>
  <PasswordReset
    :status="$store.getters['users/resetPasswordStatus']"
    :code="$store.getters['route/code']"
    @submit="data => $store.dispatch('users/resetPassword', data)"
  />
</template>

<script>
import PasswordReset from '@/authuser/components/PasswordReset'

export default {
  components: {
    PasswordReset,
  },
}
</script>
