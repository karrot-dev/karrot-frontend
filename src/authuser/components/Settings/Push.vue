<template>
  <div class="edit-box">
    <QToggle
      v-slot:control
      :label="$t('USERDATA.PUSH_CURRENT_BROWSER')"
      :disable="pending"
      :value="value"
      @input="onChange"
    />
  </div>
</template>

<script>
import {
  QToggle,
} from 'quasar'

export default {
  components: {
    QToggle,
  },
  props: {
    value: {
      required: true,
      type: Boolean,
    },
    pending: {
      required: true,
      type: Boolean,
    },
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
