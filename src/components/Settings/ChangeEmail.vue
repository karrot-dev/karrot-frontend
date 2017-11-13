<template>
  <div class="edit">
    <VerificationWarning v-if="!user.mailVerified" />

    <q-field
      icon="fa-star"
      :label="$t('USERDATA.EMAIL')">
      <q-input type="email" v-model="newEmail"/>
    </q-field>

    <q-btn color="primary" @click="save">{{ $t('BUTTON.CHANGE_EMAIL') }}</q-btn>

  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'

import VerificationWarning from '@/components/Settings/VerificationWarning'

export default {
  components: { QField, QInput, QBtn, VerificationWarning },
  props: {
    user: { required: true },
  },
  data () {
    return {
      newEmail: '',
    }
  },
  methods: {
    save () {
      this.$emit('save', this.newEmail)
    },
    setEmail () {
      if (this.user) {
        this.newEmail = this.user.email ? this.user.email : this.user.unverifiedEmail
      }
    },
  },
  watch: {
    user () {
      this.setEmail()
    },
  },
  mounted () {
    this.setEmail()
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.edit
  width 100%
  padding 20px
  background-color $grey-1
  &.changed
    background-color $yellow-1
</style>
