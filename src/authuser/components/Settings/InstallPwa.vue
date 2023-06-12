<template>
  <div class="edit-box">
    <QBtn
      @click="install"
    >
      {{ $t('USERDATA.INSTALL_APP') }}
    </QBtn>
  </div>
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

<style scoped lang="sass">
@import 'editbox'
</style>
