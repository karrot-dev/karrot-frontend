<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->
=======
<template>
  <VerifyMail
    :status="$store.getters['verifymail/verifyStatus']"
    :success="$store.getters['verifymail/success']"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import VerifyMail from '@/authuser/components/VerifyMail'

export default {
  components: {
    VerifyMail,
  },
  mounted () {
    this.$store.dispatch('verifymail/verify', this.$store.getters['route/query'].code)
  },
}
</script>
