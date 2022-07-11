<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->
=======
<template>
  <Signup
    :status="$store.getters['auth/signupStatus']"
    :prefill-email="$store.getters['route/query'].email"
    @submit="data => $store.dispatch('users/signup')"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import Signup from '@/authuser/components/Signup'

export default {
  components: {
    Signup,
  },
}
</script>
