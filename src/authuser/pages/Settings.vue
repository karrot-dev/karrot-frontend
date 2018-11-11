<template>
  <div v-if="user">
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
    <q-card
      v-if="!$q.platform.is.cordova"
      class="no-shadow grey-border"
    >
      <q-card-title>{{ $t('USERDATA.PUSH') }}</q-card-title>
      <q-card-main>
        <Push
          :value="pushEnabled"
          :pending="pushPending"
          @enable="enablePush"
          @disable="disablePush"
        />
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions } from 'quasar'
import { mapGetters, mapActions } from 'vuex'

import ProfileEdit from '@/authuser/components/Settings/ProfileEdit'
import ChangePassword from '@/authuser/components/Settings/ChangePassword'
import ChangeEmail from '@/authuser/components/Settings/ChangeEmail'
import ChangePhoto from '@/authuser/components/Settings/ChangePhoto'
import RequestDeleteAccount from '@/authuser/components/Settings/RequestDeleteAccount'
import Push from '@/authuser/components/Settings/Push'

export default {
  name: 'Settings',
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QCardActions,
    ProfileEdit,
    ChangePassword,
    ChangeEmail,
    ChangePhoto,
    RequestDeleteAccount,
    Push,
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      profileEditStatus: 'auth/saveStatus',
      changePasswordStatus: 'auth/changePasswordStatus',
      changeEmailStatus: 'auth/changeEmailStatus',
      requestDeleteAccountStatus: 'users/requestDeleteAccountStatus',
      pushEnabled: 'auth/push/enabled',
      pushPending: 'auth/push/pending',
    }),
  },
  methods: {
    ...mapActions({
      saveUser: 'auth/save',
      changeEmail: 'auth/changeEmail',
      changePassword: 'auth/changePassword',
      requestDeleteAccount: 'users/requestDeleteAccount',
      enablePush: 'auth/push/enable',
      disablePush: 'auth/push/disable',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
