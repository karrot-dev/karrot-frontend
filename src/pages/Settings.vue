<template>
  <div class="generic-padding">
  <q-list no-border>
    <q-select
      @change="setNewLocale" 
      v-model="select"
      :options="allLocales"
    />
    <q-item>
      <q-item-side>
        <i class="fa fa-user"/>
      </q-item-side>
      <q-item-main>Profile Info</q-item-main>
    </q-item>
  </q-list>
  </div>
</template>

<script>
import { QList, QItem, QItemSide, QItemMain, QSelect } from 'quasar'
import store from '@/store'
import { locales } from '@/i18n'

import { mapActions } from 'vuex'

export default {
  components: { QList, QItem, QItemSide, QItemMain, QSelect },
  metaInfo () {
    return {
      title: this.$t('SETTINGS.TITLE'),
    }
  },
  data () {
    return {
      locales,
      select: this.locale,
    }
  },
  computed: {
    allLocales () {
      let cur = this.locales.map((loc) => { return {label: loc.name, value: loc.locale, obj: loc} })
      return cur
    },
    locale: {
      get () {
        return store.state.i18n.locale
      },
      set (locale) {
        this.setLocale({ locale })
      },
    },
  },
  methods: {
    ...mapActions({
      setLocale: 'i18n/setLocale',
    }),
    setNewLocale (test) {
      let tess = this.allLocales.filter((el) => { return el.value === test })
      this.setLocale(tess[0].obj)
    },
  },
  mounted () {
    this.select = this.locale
  },
}
</script>

<style scoped lang="stylus">
</style>
