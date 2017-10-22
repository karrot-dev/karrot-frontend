<template>
  <q-btn small>
    <q-icon class="globe" name="fa-globe" />
    {{ current }}
    <q-popover ref="popover">
      <q-list-header>choose your language</q-list-header>
      <q-list>
        <q-item v-for="locale in localeOptions" :key="locale.value"
          @click="setLocale(locale.value), $refs.popover.close()"
          highlight
          >
          <q-item-main>
            <q-item-tile label>{{ locale.label }}</q-item-tile>
            <q-item-tile sublabel><q-progress :percentage="locale.percentage" /></q-item-tile>
          </q-item-main>
        </q-item>
        <q-item-separator />
        <q-item tag="a" @click="$refs.popover.close()"
          href="https://www.transifex.com/yunity-1/karrot/dashboard/"
          target="_blank"
          rel="nofollow noopener noreferrer"
          >
          <q-item-main>
            <q-icon name="fa-external-link" />
            {{ $t('LANGUAGECHOOSER.ADD_MORE') }}
          </q-item-main>
        </q-item>
      </q-list>
    </q-popover>
  </q-btn>
</template>

<script>
import { QProgress, QIcon, QBtn, QPopover, QList, QItem, QItemTile, QItemSide, QListHeader, QItemSeparator, QItemMain } from 'quasar'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LocaleSelect',
  components: { QProgress, QIcon, QBtn, QPopover, QList, QItem, QItemTile, QItemSide, QListHeader, QItemSeparator, QItemMain },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      current: 'i18n/locale',
      localeOptions: 'i18n/localeOptions',
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
