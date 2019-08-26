<template>
  <QInput
    v-bind="$attrs"
    outlined
    hide-bottom-space
    bg-color="white"
    v-on="$listeners"
  >
    <template v-slot:before>
      <QIcon
        :name="icon"
        color="grey-5"
      />
    </template>
  </QInput>
</template>

<script>
import {
  QInput,
  QIcon,
} from 'quasar'

export default {
  components: {
    QInput,
    QIcon,
  },
  inheritAttrs: false,
  props: {
    icon: {
      default: null,
      type: String,
    },
  },
}
</script>
