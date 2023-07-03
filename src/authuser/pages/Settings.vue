<template>
  <div v-if="user">
    <KFormContainer>
      <QCardSection>
        <div class="text-h6">
          {{ $t('USERDATA.PROFILE_TITLE') }}
        </div>
      </QCardSection>
      <QCardSection>
        <ProfileEdit
          :value="user"
          :status="profileEditStatus"
          :default-map-center="defaultMapCenter"
          @save="saveUser"
        />
      </QCardSection>
    </KFormContainer>
    <KFormContainer>
      <QCardSection>
        <div class="text-h6">
          {{ $t('LANGUAGECHOOSER.SWITCH') }}
        </div>
      </QCardSection>
      <QCardSection>
        <div class="edit-box row justify-end">
          <LocaleSelect />
        </div>
      </QCardSection>
    </KFormContainer>
    <KFormContainer>
      <QCardSection>
        <div class="text-h6">
          {{ $t('USERDATA.ACCOUNT') }}
        </div>
      </QCardSection>
      <QCardSection>
        <ChangeEmail
          :user="user"
          :status="changeEmailStatus"
          @save="changeEmail"
        />
        <QSeparator />
        <ChangePassword
          :status="changePasswordStatus"
          @save="changePassword"
        />
        <QCardActions>
          <RequestDeleteAccount
            :status="requestDeleteAccountStatus"
            @request-delete-account="requestDeleteAccount"
          />
        </QCardActions>
      </QCardSection>
    </KFormContainer>
    <GroupSettings />
    <KFormContainer
      v-if="!$q.platform.is.cordova && pushIsSupported"
    >
      <QCardSection>
        <div class="text-h6">
          {{ $t('USERDATA.PUSH') }}
        </div>
      </QCardSection>
      <QCardSection>
        <Push />
      </QCardSection>
    </KFormContainer>
    <KFormContainer
      v-if="!$q.platform.is.cordova && hasPwaInstallPrompt()"
    >
      <QCardSection>
        <div class="text-h6">
          {{ $t('USERDATA.APP') }}
        </div>
      </QCardSection>
      <QCardSection>
        <InstallPwa />
      </QCardSection>
    </KFormContainer>
  </div>
</template>

<script setup>
import {
  QCardSection,
  QSeparator,
  QCardActions,
} from 'quasar'

import {
  useChangeEmailMutation,
  useChangePasswordMutation,
  useRequestDeleteAccountMutation,
  useSaveUserMutation,
} from '@/authuser/mutations'
import { useAuthService } from '@/authuser/services'
import { useGeoService } from '@/base/services/geo'
import { hasPwaInstallPrompt } from '@/base/services/pwa'
import { usePushService } from '@/subscriptions/services/push'
import { showToast } from '@/utils/toasts'

import ChangeEmail from '@/authuser/components/Settings/ChangeEmail.vue'
import ChangePassword from '@/authuser/components/Settings/ChangePassword.vue'
import InstallPwa from '@/authuser/components/Settings/InstallPwa.vue'
import ProfileEdit from '@/authuser/components/Settings/ProfileEdit.vue'
import Push from '@/authuser/components/Settings/Push.vue'
import RequestDeleteAccount from '@/authuser/components/Settings/RequestDeleteAccount.vue'
import KFormContainer from '@/base/components/KFormContainer.vue'
import GroupSettings from '@/group/components/GroupSettings.vue'
import LocaleSelect from '@/utils/components/LocaleSelect.vue'

const { user } = useAuthService()

const {
  mutateAsync: saveUserMutation,
  status: profileEditStatus,
} = useSaveUserMutation()

const {
  mutate: requestDeleteAccount,
  status: requestDeleteAccountStatus,
} = useRequestDeleteAccountMutation()

const {
  mutate: changeEmail,
  status: changeEmailStatus,
} = useChangeEmailMutation()

const {
  mutate: changePassword,
  status: changePasswordStatus,
} = useChangePasswordMutation()

const {
  isSupported: pushIsSupported,
} = usePushService()

const {
  defaultMapCenter,
} = useGeoService()

async function saveUser (data) {
  await saveUserMutation(data)
  showToast({
    message: 'NOTIFICATIONS.CHANGES_SAVED',
    config: {
      timeout: 2000,
      icon: 'thumb_up',
    },
  })
}
</script>

<style scoped lang="sass">
@import 'editbox'

</style>
