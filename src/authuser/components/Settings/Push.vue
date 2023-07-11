<template>
  <QToggle
    :label="$t('USERDATA.PUSH_CURRENT_BROWSER')"
    :disable="isPending"
    :model-value="isEnabled"
    @update:model-value="update"
  />
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
  if (value) {
    enable()
  }
  else {
    disable()
  }
}

</script>
