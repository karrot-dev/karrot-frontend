<template>
  <div class="generic-padding grey-border">
    <q-list no-border highlight>
      <q-list-header>Language</q-list-header>
      <q-item style="padding-top: 0">
        <q-item-side>
          <i class="fa fa-fw fa-language"/>
        </q-item-side>
        <q-item-main>
          <q-select
            @change="setNewLocale"
            v-model="select"
            :options="allLocales"
          />
        </q-item-main>
      </q-item>

      <q-list-header>Profile</q-list-header>
      <q-item>
        <q-item-side>
          <i class="fa fa-fw fa-user"/>
        </q-item-side>
        <q-item-main>Edit Profile Info</q-item-main>
      </q-item>
      <q-item>
        <q-item-side>
          <i class="fa fa-fw fa-envelope"/>
        </q-item-side>
        <q-item-main>Resend Mail verification</q-item-main>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { QList, QItem, QItemSide, QListHeader, QItemSeparator, QItemMain, QSelect } from 'quasar'
import store from '@/store'
import { locales } from '@/i18n'

import { mapActions } from 'vuex'

export default {
  components: { QList, QItem, QItemSide, QListHeader, QItemSeparator, QItemMain, QSelect },
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
