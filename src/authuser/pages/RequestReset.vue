<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->
=======
<template>
  <RequestPasswordReset
    :status="$store.getters['users/requestResetPasswordStatus']"
    @submit="data => $store.dispatch('users/requestResetPassword', data)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import RequestPasswordReset from '@/authuser/components/RequestPasswordReset'

export default {
  components: {
    RequestPasswordReset,
  },
}
</script>
