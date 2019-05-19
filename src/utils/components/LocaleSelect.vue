<template>
  <QBtn
    :flat="inToolbar"
    :dense="inToolbar"
    :round="inToolbar"
    :title="$t('LANGUAGECHOOSER.SWITCH')"
    class="k-locale-select"
    @click="open = !open"
  >
    <QIcon
      name="fas fa-globe fa-fw"
    />
    <template
      v-if="!inToolbar"
    >
      {{ currentName }}
    </template>
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
import { mapGetters } from 'vuex'
import locales from '@/locales/index'

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
  props: {
    inToolbar: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      open: false,
    }
  },
  computed: {
    ...mapGetters({
      current: 'i18n/locale',
    }),
    currentName () {
      if (!this.current) return ''
      return locales[this.current].name
    },
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
