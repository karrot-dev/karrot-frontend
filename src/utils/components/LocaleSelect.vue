<template>
  <q-btn
    flat
    dense
    round
    @click="open = !open"
    :title="$t('LANGUAGECHOOSER.SWITCH')"
  >
    <q-icon
      name="fas fa-globe fa-fw"
    />
    <component
      :is="$q.platform.is.mobile ? 'q-modal' : 'q-popover'"
      v-model="open"
      minimized
    >
      <div
        v-if="$q.platform.is.mobile"
        class="text-white bg-primary row no-wrap justify-between items-center"
      >
        <div class="ellipsis q-ml-md">
          {{ $t('LANGUAGECHOOSER.SWITCH') }}
        </div>
        <q-btn
          dense
          round
          color="secondary"
          @click="open = false"
          class="q-ma-xs q-mr-sm"
        >
          <q-icon name="fas fa-times" />
        </q-btn>
      </div>
      <LocaleSelectInner v-if="open"/>
    </component>
  </q-btn>
</template>

<script>
import { QIcon, QBtn, QPopover, QModal, QList } from 'quasar'

const LocaleSelectInner = () => import('./LocaleSelectInner')

export default {
  name: 'LocaleSelect',
  components: {
    QIcon,
    QBtn,
    QPopover,
    QModal,
    QList,
    LocaleSelectInner,
  },
  data () {
    return {
      open: false,
    }
  },
}
</script>
