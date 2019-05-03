<template>
  <div class="edit-box">
    <QField
      icon="fas fa-bell"
      :label="$t('USERDATA.PUSH_CURRENT_BROWSER')"
    >
      <QToggle
        :disable="pending"
        :value="value"
        @change="onChange"
      />
    </QField>
  </div>
</template>

<script>
import { QField, QToggle } from 'quasar'

export default {
  components: { QField, QToggle },
  props: {
    value: { required: true, type: Boolean },
    pending: { required: true, type: Boolean },
  },
  methods: {
    onChange (value) {
      this.$emit(value ? 'enable' : 'disable')
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
