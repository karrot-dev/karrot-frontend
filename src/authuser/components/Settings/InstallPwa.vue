<template>
  <QBtn
    @click="install"
  >
    {{ $t('USERDATA.INSTALL_APP') }}
  </QBtn>
</template>

<script setup>
import {
  QBtn,
} from 'quasar'

import { getPwaInstallPrompt } from '@/base/services/pwa'

const pwaInstallPrompt = getPwaInstallPrompt()

function install () {
  pwaInstallPrompt.prompt()
}
</script>
