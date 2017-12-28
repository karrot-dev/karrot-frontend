<template>
  <div>
    <q-card class="no-shadow grey-border">
      <q-card-title>{{ $t('USERDATA.PROFILE_TITLE') }}</q-card-title>
      <q-card-main>
        <ProfileEdit
          :value="user"
          :status="profileEditStatus"
          @save="saveUser"
        />
      </q-card-main>
    </q-card>
    <q-card class="no-shadow grey-border">
      <q-card-title>{{ $t('USERDATA.EMAIL') }}</q-card-title>
      <q-card-main>
        <ChangeEmail
          :user="user"
          :status="changeEmailStatus"
          @save="changeEmail"
        />
      </q-card-main>
    </q-card>
    <q-card class="no-shadow grey-border">
      <q-card-title>{{ $t('USERDATA.PASSWORD') }}</q-card-title>
      <q-card-main>
        <ChangePassword
          :status="changePasswordStatus"
          @save="changePassword"
        />
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import { QCard, QCardTitle, QCardMain } from 'quasar'
import ProfileEdit from '@/components/Settings/ProfileEdit'
import ChangePassword from '@/components/Settings/ChangePassword'
import ChangeEmail from '@/components/Settings/ChangeEmail'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Settings',
  components: { QCard, QCardTitle, QCardMain, ProfileEdit, ChangePassword, ChangeEmail },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      profileEditStatus: 'auth/updateStatus',
      changePasswordStatus: 'auth/changePasswordStatus',
      changeEmailStatus: 'auth/changeEmailStatus',
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
