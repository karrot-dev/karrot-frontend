<template>
  <div class="generic-padding grey-border">
    <q-list no-border>
      <q-list-header>{{ $t('SETTINGS.LANGUAGE') }}</q-list-header>
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
        <profile-edit :user="user" @save="saveUser"/>
      </q-item>

      <q-list-header>Email address</q-list-header>

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
import { QList, QItem, QItemSide, QListHeader, QItemSeparator, QItemMain, QSelect, QCollapsible } from 'quasar'
import store from '@/store'
import { locales } from '@/i18n'
import ProfileEdit from '@/components/ProfileEdit'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Settings',
  components: { QList, QItem, QItemSide, QListHeader, QItemSeparator, QItemMain, QSelect, QCollapsible, ProfileEdit },
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
    ...mapGetters({
      'user': 'auth/user',
    }),
  },
  methods: {
    ...mapActions({
      setLocale: 'i18n/setLocale',
      saveUser: 'auth/update',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
