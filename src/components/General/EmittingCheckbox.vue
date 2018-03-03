<template>
  <q-checkbox v-model="value"/>
</template>

<script>
import { QCheckbox } from 'quasar'
export default {
  name: 'EmittingCheckbox',
  components: { QCheckbox },
  props: {
    enabled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    value: {
      get () {
        return this.enabled
      },
      set (val) {
        this.$emit('change', val)
      },
    },
  },
}
</script>
