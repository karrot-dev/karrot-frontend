<template>
  <DeleteAccount
    :status="$store.getters['deleteAccount/deleteAccountStatus']"
    :success="$store.getters['deleteAccount/success']"
  />
</template>

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
