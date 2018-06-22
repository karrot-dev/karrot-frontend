<template>
  <q-btn
    flat
    dense
    round
  >
    <q-icon
      name="fas fa-globe fa-fw"
    />
    <q-popover
      @show="open = true"
      @hide="open = false"
    >
      <LocaleSelectInner v-if="open"/>
    </q-popover>
    <q-tooltip v-t="'LANGUAGECHOOSER.SWITCH'" />
  </q-btn>
</template>

<script>
import { QIcon, QBtn, QPopover, QList, QTooltip } from 'quasar'

const LocaleSelectInner = () => import('./LocaleSelectInner')

export default {
  name: 'LocaleSelect',
  components: {
    QIcon,
    QBtn,
    QPopover,
    QList,
    QTooltip,
    LocaleSelectInner,
  },
  data () {
    return {
      open: false,
    }
  },
}
</script>
