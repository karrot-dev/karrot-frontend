<template>
  <div class="edit">

    <q-field
      icon="fa-star"
      :label="$t('USERDETAIL.PASSWORD')">
      <q-input type="password" v-model="newPassword"/>
    </q-field>

    <q-btn color="primary" @click="save">{{ $t('BUTTON.CHANGE_PASSWORD') }}</q-btn>

  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'

export default {
  components: { QField, QInput, QBtn },
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
