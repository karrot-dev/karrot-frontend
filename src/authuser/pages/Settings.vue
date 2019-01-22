<template>
  <div v-if="user">
    <QCard class="no-shadow grey-border">
      <QCardTitle>{{ $t('USERDATA.PROFILE_TITLE') }}</QCardTitle>
      <QCardMain>
        <ChangePhoto
          :value="user"
          :status="profileEditStatus"
          :label="$t('USERDATA.PHOTO')"
          :helper="$t('USERDATA.SET_PHOTO')"
          mime-type="image/jpeg"
          @save="saveUser({ photo: arguments[0] })"
        />
        <QCardSeparator />
        <ProfileEdit
          :value="user"
          :status="profileEditStatus"
          @save="saveUser"
        />
      </QCardMain>
    </QCard>
    <QCard class="no-shadow grey-border">
      <QCardTitle>{{ $t('USERDATA.ACCOUNT') }}</QCardTitle>
      <QCardMain>
        <ChangeEmail
          :user="user"
          :status="changeEmailStatus"
          @save="changeEmail"
        />
        <QCardSeparator />
        <ChangePassword
          :status="changePasswordStatus"
          @save="changePassword"
        />
        <QCardActions>
          <RequestDeleteAccount
            :status="requestDeleteAccountStatus"
            @requestDeleteAccount="requestDeleteAccount"
          />
        </QCardActions>
      </QCardMain>
    </QCard>
    <QCard
      v-if="!$q.platform.is.cordova"
      class="no-shadow grey-border"
    >
      <QCardTitle>{{ $t('USERDATA.PUSH') }}</QCardTitle>
      <QCardMain>
        <Push
          :value="pushEnabled"
          :pending="pushPending"
          @enable="enablePush"
          @disable="disablePush"
        />
      </QCardMain>
    </QCard>
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
