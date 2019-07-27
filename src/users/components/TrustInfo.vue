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
    >
      <QCard>
        <QCardSection>
          <div class="text-h6">
            {{ $t('USERDATA.TRUST_INFO.TITLE') }}
          </div>
        </QCardSection>
        <QCardSection>
          <p v-t="'USERDATA.TRUST_INFO.MESSAGE'" />
          <a
            v-t="'USERDATA.TRUST_INFO.LINK'"
            href="https://community.foodsaving.world/t/karrot-trust-system-and-user-levels/108"
            target="_blank"
            rel="noopener"
            style="text-decoration: underline"
          />
        </QCardSection>
        <QCardActions align="right">
          <QBtn
            v-close-popup
            flat
            :label="$t('BUTTON.CLOSE')"
          />
        </QCardActions>
      </QCard>
    </QDialog>
  </QBtn>
</template>

<script>
import {
  QBtn,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
} from 'quasar'

export default {
  components: {
    QBtn,
    QDialog,
    QCard,
    QCardSection,
    QCardActions,
  },
  data () {
    return {
      showInfo: false,
    }
  },
}
</script>
