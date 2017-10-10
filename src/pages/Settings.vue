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
            v-model="locale"
            :options="localeOptions"
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
  name: 'Settings',
  components: { QList, QItem, QItemSide, QListHeader, QItemSeparator, QItemMain, QSelect },
  data () {
    return {
      localeOptions: locales.map(({ name, locale }) => ({ label: name, value: locale })),
    }
  },
  computed: {
    locale: {
      get () {
        return store.state.i18n.locale
      },
      set (locale) {
        this.setLocale(locale)
      },
    },
  },
  methods: {
    ...mapActions({
      setLocale: 'i18n/setLocale',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
