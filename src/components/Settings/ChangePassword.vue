<template>
  <div class="edit">

    <q-field
      icon="fa-star"
      :label="$t('USERDETAIL.PASSWORD')"
      :error="hasAnyError"
      :error-label="anyError">
      <q-input type="password" v-model="newPassword"/>
    </q-field>

    <q-btn color="primary" @click="save" loader :value="isPending">{{ $t('BUTTON.CHANGE_PASSWORD') }}</q-btn>

  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QField, QInput, QBtn },
  mixins: [statusMixin],
  data () {
    return {
      oldPassword: '',
      newPassword: '',
    }
  },
  methods: {
    save () {
      const { oldPassword, newPassword } = this
      this.$emit('save', { oldPassword, newPassword })
    },
  },
  computed: {
    hasAnyError () {
      return !!this.anyError
    },
    anyError () {
      for (let field of ['password', 'nonFieldErrors', 'detail']) {
        if (this.hasError(field)) return this.firstError(field)
      }
    },
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
