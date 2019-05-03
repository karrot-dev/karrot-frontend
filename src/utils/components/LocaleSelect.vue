<template>
  <QBtn
    flat
    dense
    round
    :title="$t('LANGUAGECHOOSER.SWITCH')"
    class="k-locale-select"
    @click="open = !open"
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
          class="q-ma-xs q-mr-sm"
          @click="open = false"
        >
          <QIcon name="fas fa-times" />
        </QBtn>
      </div>
      <LocaleSelectInner v-if="open" />
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

<style lang="stylus" scoped>
@import '~variables'
.k-locale-select
  .q-icon
    opacity $topbar-opacity-low
  &:hover .q-icon
    opacity 1
</style>
