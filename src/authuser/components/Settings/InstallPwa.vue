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

<style scoped lang="stylus">
@import '~editbox'
</style>
