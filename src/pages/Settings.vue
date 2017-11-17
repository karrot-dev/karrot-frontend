<template>
  <div class="generic-padding grey-border">
    <q-list no-border>
      <q-list-header>{{ $t('USERDATA.PROFILE_TITLE') }}</q-list-header>

      <q-item>
        <ProfileEdit :user="user" @save="saveUser"/>
      </q-item>

      <q-list-header>{{ $t('USERDATA.EMAIL') }}</q-list-header>

      <q-item>
        <ChangeEmail :user="user" :status="changeEmailStatus" @save="changeEmail" />
      </q-item>

      <q-list-header>{{ $t('USERDATA.PASSWORD') }}</q-list-header>

      <q-item>
        <ChangePassword :status="changePasswordStatus" @save="changePassword" />
      </q-item>

    </q-list>
  </div>
</template>

<script>
import { QList, QItem, QListHeader } from 'quasar'
import ProfileEdit from '@/components/Settings/ProfileEdit'
import ChangePassword from '@/components/Settings/ChangePassword'
import ChangeEmail from '@/components/Settings/ChangeEmail'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Settings',
  components: { QList, QItem, QListHeader, ProfileEdit, ChangePassword, ChangeEmail },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      changeEmailStatus: 'auth/changeEmailStatus',
      changePasswordStatus: 'auth/changePasswordStatus',
    }),
  },
  methods: {
    ...mapActions({
      saveUser: 'auth/update',
      changePassword: 'auth/changePassword',
      changeEmail: 'auth/changeEmail',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
