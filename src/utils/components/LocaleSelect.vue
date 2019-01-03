<template>
  <QBtn
    flat
    dense
    round
    @click="open = !open"
    :title="$t('LANGUAGECHOOSER.SWITCH')"
  >
    <QIcon
      name="fas fa-globe fa-fw"
    />
    <Component
      :is="$q.platform.is.mobile ? 'QModal' : 'QPopover'"
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
        <QBtn
          dense
          round
          color="secondary"
          @click="open = false"
          class="q-ma-xs q-mr-sm"
        >
          <QIcon name="fas fa-times" />
        </QBtn>
      </div>
      <LocaleSelectInner v-if="open"/>
    </Component>
  </QBtn>
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
