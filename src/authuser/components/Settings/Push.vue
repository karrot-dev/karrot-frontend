<template>
  <div class="edit-box">
    <QToggle
      :label="$t('USERDATA.PUSH_CURRENT_BROWSER')"
      :disable="isPending"
      :model-value="isEnabled"
      @update:model-value="update"
    />
  </div>
</template>

<script setup>
import {
  QToggle,
} from 'quasar'

import { usePushService } from '@/subscriptions/services/push'

const {
  enable,
  disable,
  isEnabled,
  isPending,
} = usePushService()

function update (value) {
  console.log('updating!', value)
  if (value) {
    enable()
  }
  else {
    disable()
  }
}

</script>

<style scoped lang="sass">
@import '~editbox'
</style>
