<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->
=======
<template>
  <DeleteAccount
    :status="$store.getters['deleteAccount/deleteAccountStatus']"
    :success="$store.getters['deleteAccount/success']"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import DeleteAccount from '@/authuser/components/Settings/DeleteAccount'

export default {
  components: {
    DeleteAccount,
  },
  mounted () {
    // when page is loaded, use the `?code` route parameter to trigger deletion
    this.$store.dispatch('deleteAccount/deleteAccount', this.$store.getters['route/query'].code)
  },
}
</script>
