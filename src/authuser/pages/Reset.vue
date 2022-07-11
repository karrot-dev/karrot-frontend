<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->
=======
<template>
  <PasswordReset
    :status="$store.getters['users/resetPasswordStatus']"
    :code="$store.getters['route/code']"
    @submit="data => $store.dispatch('users/resetPassword', data)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import PasswordReset from '@/authuser/components/PasswordReset'

export default {
  components: {
    PasswordReset,
  },
}
</script>
