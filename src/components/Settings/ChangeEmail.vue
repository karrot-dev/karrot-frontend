<template>
  <div class="edit">
    <VerificationWarning v-if="user && !user.mailVerified" />

    <q-field
      icon="fa-star"
      :label="$t('USERDATA.EMAIL')"
      :error="hasAnyError"
      :error-label="anyError">
      <q-input type="email" v-model="newEmail"/>
    </q-field>

    <q-btn color="primary" @click="save" loader :value="isPending">{{ $t('BUTTON.CHANGE_EMAIL') }}</q-btn>

  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import statusMixin from '@/mixins/statusMixin'
import VerificationWarning from '@/components/Settings/VerificationWarning'

export default {
  components: { QField, QInput, QBtn, VerificationWarning },
  mixins: [statusMixin],
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
  computed: {
    hasAnyError () {
      return !!this.anyError
    },
    anyError () {
      for (let field of ['email', 'nonFieldErrors', 'detail']) {
        if (this.hasError(field)) return this.firstError(field)
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
