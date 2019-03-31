<template>
  <QBtn
    flat
    round
    dense
    icon="help_outline"
    @click="showInfo = true"
  >
    <QDialog
      v-if="showInfo"
      v-model="showInfo"
      :title="$t('USERDATA.TRUST_INFO.TITLE')"
      :ok="$t('BUTTON.CLOSE')"
    >
      <template slot="message">
        <p v-t="'USERDATA.TRUST_INFO.MESSAGE'" />
        <a
          v-t="'USERDATA.TRUST_INFO.LINK'"
          href="https://community.foodsaving.world/t/karrot-trust-system-and-user-levels/108"
          target="_blank"
          rel="noopener"
          style="text-decoration: underline"
        />
      </template>
    </QDialog>
  </QBtn>
</template>

<script>
import {
  QBtn,
  QDialog,
} from 'quasar'

export default {
  components: {
    QBtn,
    QDialog,
  },
  data () {
    return {
      showInfo: false,
    }
  },
}
</script>
