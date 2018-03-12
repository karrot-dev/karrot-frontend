<template>
  <q-btn flat>
    <q-icon
      class="globe"
      name="fa-globe"
    />
    {{ current }}
    <q-popover>
      <q-list v-close-overlay>
        <q-item
          v-for="locale in localeOptions"
          :key="locale.value"
          @click.native="setLocale(locale.value)"
          highlight
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
        <q-item-separator />
        <q-item
          tag="a"
          href="https://www.transifex.com/yunity-1/karrot/dashboard/"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <q-item-main>
            <q-icon name="fa-external-link-alt" />
            <small>{{ $t('LANGUAGECHOOSER.ADD_MORE') }}</small>
          </q-item-main>
        </q-item>
      </q-list>
    </q-popover>
    <q-tooltip v-t="'LANGUAGECHOOSER.SWITCH'" />
  </q-btn>
</template>

<script>
import { QProgress, QIcon, QBtn, QPopover, QList, QItem, QItemTile, QItemSide, QListHeader, QItemSeparator, QItemMain, QTooltip } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import { localeOptions } from '@/i18n'

export default {
  name: 'LocaleSelect',
  components: { QProgress, QIcon, QBtn, QPopover, QList, QItem, QItemTile, QItemSide, QListHeader, QItemSeparator, QItemMain, QTooltip },
  data () {
    return {
      localeOptions,
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
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
.globe
  margin-right: 5px
</style>
