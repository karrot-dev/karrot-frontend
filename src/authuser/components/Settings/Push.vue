<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<template>
  <div class="edit-box">
    <QToggle
      :label="$t('USERDATA.PUSH_CURRENT_BROWSER')"
      :disable="pending"
      :model-value="value"
      @update:model-value="onChange"
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
  emits: [
    'enable',
    'disable',
  ],
  methods: {
    onChange (value) {
      this.$emit(value ? 'enable' : 'disable')
    },
  },
}
</script>

<style scoped lang="sass">
@import '~editbox'
</style>
