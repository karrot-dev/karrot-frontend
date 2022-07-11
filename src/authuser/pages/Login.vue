<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

=======
<template>
  <Login
    :status="$store.getters['auth/loginStatus']"
    @submit="data => $store.dispatch('auth/login', data)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import Login from '@/authuser/components/Login'

export default {
  components: {
    Login,
  },
}
</script>
