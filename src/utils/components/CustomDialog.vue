<template>
  <QDialog
    v-bind="$attrs"
    v-on="$listeners"
  >
    <QCard class="q-dialog-plugin">
      <QCardSection class="q-dialog__title">
        <slot name="title" />
      </QCardSection>
      <QCardSection class="q-dialog__message">
        <slot name="message" />
      </QCardSection>
      <QCardActions align="right">
        <slot name="actions" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script>
import {
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
} from 'quasar'

export default {
  components: {
    QDialog,
    QCard,
    QCardSection,
    QCardActions,
  },
}
</script>
