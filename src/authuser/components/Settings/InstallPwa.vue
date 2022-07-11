<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<template>
  <div class="edit-box">
    <QBtn
      @click="install"
    >
      {{ $t('USERDATA.INSTALL_APP') }}
    </QBtn>
  </div>
</template>

<script>
import {
  QBtn,
} from 'quasar'

export default {
  components: {
    QBtn,
  },
  props: {
    prompt: {
      required: true,
      type: Object,
    },
  },
  methods: {
    async install () {
      this.prompt.prompt()
    },
  },
}
</script>

<style scoped lang="sass">
@import '~editbox'
</style>
