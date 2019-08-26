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
    <QDialog
      v-model="open"
    >
      <LocaleSelectInner />
    </QDialog>
  </QBtn>
</template>

<script>
import {
  QIcon,
  QBtn,
  QDialog,
} from 'quasar'
import { mapGetters } from 'vuex'
import locales from '@/locales/index'

const LocaleSelectInner = () => import('./LocaleSelectInner')

export default {
  name: 'LocaleSelect',
  components: {
    QIcon,
    QBtn,
    QDialog,
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
