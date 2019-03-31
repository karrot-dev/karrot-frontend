<template>
  <QList
    v-close-overlay
    highlight
  >
    <QItem
      tag="a"
      href="https://www.transifex.com/yunity-1/karrot/dashboard/"
      target="_blank"
      rel="nofollow noopener noreferrer"
      class="q-pt-xs"
      style="min-height: 20px"
    >
      <QItemMain>
        <QItemTile sublabel>
          <QIcon name="fas fa-external-link-alt" />
          <small>{{ $t('LANGUAGECHOOSER.ADD_MORE') }}</small>
        </QItemTile>
      </QItemMain>
    </QItem>
    <QItem
      v-for="locale in localeOptions"
      :key="locale.value"
      :class="{ active: locale.value === current }"
      @click.native="setLocale(locale.value)"
    >
      <QItemMain>
        <QItemTile label>
          {{ locale.label }}
          <small>({{ locale.percentage }}%)</small>
        </QItemTile>
        <QItemTile sublabel>
          <QProgress
            v-if="locale.percentage < 100"
            :percentage="locale.percentage"
          />
        </QItemTile>
      </QItemMain>
    </QItem>
  </QList>
</template>

<script>
import {
  QProgress,
  QIcon,
  QList,
  QItem,
  QItemTile,
  QItemMain,
} from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import { localeOptions } from '@/base/i18n'

export default {
  components: {
    QProgress,
    QIcon,
    QList,
    QItem,
    QItemTile,
    QItemMain,
  },
  data () {
    return {
      localeOptions,
    }
  },
  computed: {
    ...mapGetters({
      current: 'i18n/locale',
    }),
  },
  methods: {
    ...mapActions({
      setLocale: 'i18n/setLocale',
    }),
  },
}
</script>

<style scoped lang="stylus">
.q-item
  cursor pointer
  &.active
    cursor default
</style>
