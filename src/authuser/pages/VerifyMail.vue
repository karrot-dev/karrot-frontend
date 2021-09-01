<template>
  <VerifyMail
    :status="$store.getters['verifymail/verifyStatus']"
    :success="$store.getters['verifymail/success']"
  />
</template>

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
