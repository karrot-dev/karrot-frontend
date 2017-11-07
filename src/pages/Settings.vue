<template>
  <div class="generic-padding grey-border">
    <q-list no-border>
      <q-list-header>{{ $t('SETTINGS.LANGUAGE') }}</q-list-header>
      <q-item style="padding-top: 0">
        <q-item-side>
          <i class="fa fa-fw fa-language"/>
        </q-item-side>
        <q-item-main>
          <q-select @input="setLocale" :value="locale" :options="localeOptions" />
        </q-item-main>
      </q-item>

      <q-list-header>{{ $t('USERDATA.PROFILE_TITLE') }}</q-list-header>

      <q-item>
        <ProfileEdit :user="user" @save="saveUser"/>
      </q-item>

      <q-list-header>{{ $t('USERDATA.EMAIL') }}</q-list-header>

      <q-item>
        <ChangeEmail :user="user" @save="changeEmail" />
      </q-item>

      <q-list-header>{{ $t('USERDATA.PASSWORD') }}</q-list-header>

      <q-item>
        <ChangePassword @save="changePassword" />
      </q-item>

    </q-list>
  </div>
</template>

<script>
import { QList, QItem, QItemSide, QListHeader, QItemSeparator, QItemMain, QSelect, QCollapsible } from 'quasar'
import ProfileEdit from '@/components/Settings/ProfileEdit'
import ChangePassword from '@/components/Settings/ChangePassword'
import ChangeEmail from '@/components/Settings/ChangeEmail'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Settings',
  components: { QList, QItem, QItemSide, QListHeader, QItemSeparator, QItemMain, QSelect, QCollapsible, ProfileEdit, ChangePassword, ChangeEmail },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      locale: 'i18n/locale',
      localeOptions: 'i18n/localeOptions',
    }),
  },
  methods: {
    ...mapActions({
      setLocale: 'i18n/setLocale',
      saveUser: 'auth/update',
      changePassword: 'auth/changePassword',
      changeEmail: 'auth/changeEmail',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
