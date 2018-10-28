<template>
  <q-list
    v-close-overlay
    highlight
  >
    <q-item
      tag="a"
      href="https://www.transifex.com/yunity-1/karrot/dashboard/"
      target="_blank"
      rel="nofollow noopener noreferrer"
      class="q-pt-xs"
      style="min-height: 20px"
    >
      <q-item-main>
        <q-item-tile sublabel>
          <q-icon name="fas fa-external-link-alt" />
          <small>{{ $t('LANGUAGECHOOSER.ADD_MORE') }}</small>
        </q-item-tile>
      </q-item-main>
    </q-item>
    <q-item
      v-for="locale in localeOptions"
      :key="locale.value"
      @click.native="setLocale(locale.value)"
      :class="{ active: locale.value === current }"
    >
      <q-item-main>
        <q-item-tile label>
          {{ locale.label }}
          <small>({{ locale.percentage }}%)</small>
        </q-item-tile>
        <q-item-tile sublabel>
          <q-progress
            v-if="locale.percentage < 100"
            :percentage="locale.percentage"
          />
        </q-item-tile>
      </q-item-main>
    </q-item>
  </q-list>
</template>

<script>
import { QProgress, QIcon, QList, QItem, QItemTile, QItemSide, QListHeader, QItemSeparator, QItemMain } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import { localeOptions } from '@/base/i18n'

export default {
  components: {
    QProgress,
    QIcon,
    QList,
    QItem,
    QItemTile,
    QItemSide,
    QListHeader,
    QItemSeparator,
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
