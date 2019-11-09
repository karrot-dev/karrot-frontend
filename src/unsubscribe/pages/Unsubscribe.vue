<template>
  <Unsubscribe
    :token-data="tokenData"
    :has-invalid-token="hasInvalidToken"
    :has-error="hasError"
    :has-success="hasSuccess"
    @save="save"
  />
</template>

<script>
import Unsubscribe from '@/unsubscribe/components/Unsubscribe'

import api from '@/unsubscribe/api/unsubscribe'
import { parseToken } from '@/unsubscribe/utils'

export default {
  components: {
    Unsubscribe,
  },
  data () {
    return {
      hasInvalidToken: false,
      hasError: false,
      hasSuccess: false,
      token: this.$route.params.token,
    }
  },
  computed: {
    tokenData () {
      return this.token ? this.parseToken(this.token) : {}
    },
  },
  methods: {
    async save (choice) {
      this.hasError = false
      try {
        await api.tokenUnsubscribe(this.token, { choice })
        this.hasSuccess = true
      }
      catch (err) {
        this.hasError = true
      }
    },
    parseToken (token) {
      try {
        return parseToken(token)
      }
      catch (err) {
        this.hasInvalidToken = true
      }
    },
    ensureDefaultChoice () {
      if (this.choice || this.options.length === 0) return
      this.choice = this.options[0].value
    },
  },
}
</script>
