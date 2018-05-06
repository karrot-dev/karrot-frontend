<template>
  <div>
    <q-card class="no-shadow grey-border">
      <q-card-title>{{ $t('USERDATA.PROFILE_TITLE') }}</q-card-title>
      <q-card-main>
        <ChangePhoto
          :value="user"
          :status="profileEditStatus"
          @save="saveUser"
        />
        <q-card-separator />
        <ProfileEdit
          :value="user"
          :status="profileEditStatus"
          @save="saveUser"
        />
      </q-card-main>
    </q-card>
    <q-card class="no-shadow grey-border">
      <q-card-title>{{ $t('USERDATA.ACCOUNT') }}</q-card-title>
      <q-card-main>
        <ChangeEmail
          :user="user"
          :status="changeEmailStatus"
          @save="changeEmail"
        />
        <q-card-separator />
        <ChangePassword
          :status="changePasswordStatus"
          @save="changePassword"
        />
        <q-card-actions>
          <RequestDeleteAccount
            :status="requestDeleteAccountStatus"
            @requestDeleteAccount="requestDeleteAccount"
          />
        </q-card-actions>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions } from 'quasar'
import { mapGetters, mapActions } from 'vuex'

import ProfileEdit from '@/components/Settings/ProfileEdit'
import ChangePassword from '@/components/Settings/ChangePassword'
import ChangeEmail from '@/components/Settings/ChangeEmail'
import ChangePhoto from '@/components/Settings/ChangePhoto'
import RequestDeleteAccount from '@/components/Settings/RequestDeleteAccount'

export default {
  name: 'Settings',
  components: { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, ProfileEdit, ChangePassword, ChangeEmail, ChangePhoto, RequestDeleteAccount },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      profileEditStatus: 'auth/saveStatus',
      changePasswordStatus: 'auth/changePasswordStatus',
      changeEmailStatus: 'auth/changeEmailStatus',
      requestDeleteAccountStatus: 'users/requestDeleteAccountStatus',
    }),
  },
  methods: {
    ...mapActions({
      saveUser: 'auth/save',
      changeEmail: 'auth/changeEmail',
      changePassword: 'auth/changePassword',
      requestDeleteAccount: 'users/requestDeleteAccount',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
