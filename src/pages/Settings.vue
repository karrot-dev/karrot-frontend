<template>
  <div class="generic-padding grey-border">

    <verification-warning></verification-warning>

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
        <profile-edit :user="user" @save="saveUser"/>
      </q-item>

      <q-list-header>{{ $t('USERDATA.PASSWORD') }}</q-list-header>

      <q-item>
        <change-password @save="changePassword"/>
      </q-item>

      <q-list-header>{{ $t('USERDATA.EMAIL') }}</q-list-header>

    </q-list>
  </div>
</template>

<script>
import { QList, QItem, QItemSide, QListHeader, QItemSeparator, QItemMain, QSelect, QCollapsible } from 'quasar'
import ProfileEdit from '@/components/Settings/ProfileEdit'
import ChangePassword from '@/components/Settings/ChangePassword'
import VerificationWarning from '@/components/Settings/VerificationWarning'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Settings',
  components: { QList, QItem, QItemSide, QListHeader, QItemSeparator, QItemMain, QSelect, QCollapsible, ProfileEdit, ChangePassword, VerificationWarning },
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
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
