<template>
  <div v-if="user">
    <KFormContainer>
      <QCardSection>
        <div class="text-h6">
          {{ $t('USERDATA.PROFILE_TITLE') }}
        </div>
      </QCardSection>
      <QCardSection>
        <ChangePhoto
          :value="user"
          :status="profileEditStatus"
          :label="$t('USERDATA.PHOTO')"
          :hint="$t('USERDATA.SET_PHOTO')"
          mime-type="image/jpeg"
          @save="photo => saveUser({ photo })"
        />
        <QSeparator />
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
    <GroupSettings
      :status="$store.getters['unsubscribe/allEmailsPerGroupStatus']"
      @unsubscribe-all-emails="data => $store.dispatch('unsubscribe/allEmailsPerGroup', data)"
      @clear-unsubscribe-all-status="data => $store.dispatch('unsubscribe/clear', data)"
    />
    <KFormContainer
      v-if="!$q.platform.is.cordova"
    >
      <QCardSection>
        <div class="text-h6">
          {{ $t('USERDATA.PUSH') }}
        </div>
      </QCardSection>
      <QCardSection>
        <Push
          :value="pushEnabled"
          :pending="pushPending"
          @enable="enablePush"
          @disable="disablePush"
        />
      </QCardSection>
    </KFormContainer>
    <KFormContainer
      v-if="!$q.platform.is.cordova && pwaPrompt"
    >
      <QCardSection>
        <div class="text-h6">
          {{ $t('USERDATA.APP') }}
        </div>
      </QCardSection>
      <QCardSection>
        <InstallPwa
          :prompt="pwaPrompt"
        />
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

import ProfileEdit from '@/authuser/components/Settings/ProfileEdit'
import ChangePassword from '@/authuser/components/Settings/ChangePassword'
import ChangeEmail from '@/authuser/components/Settings/ChangeEmail'
import ChangePhoto from '@/authuser/components/Settings/ChangePhoto'
import RequestDeleteAccount from '@/authuser/components/Settings/RequestDeleteAccount'
import Push from '@/authuser/components/Settings/Push'
import InstallPwa from '@/authuser/components/Settings/InstallPwa'
import LocaleSelect from '@/utils/components/LocaleSelect'
import GroupSettings from '@/group/components/GroupSettings'
import KFormContainer from '@/base/components/KFormContainer'
import {
  useChangeEmailMutation,
  useChangePasswordMutation,
  useRequestDeleteAccountMutation, useSaveUserMutation,
} from '@/authuser/mutations'

import { useAuthService } from '@/authuser/services'
import { usePushService } from '@/subscriptions/services'
import { getPwaInstallPrompt, useGeoService } from '@/base/services'
import { showToast } from '@/utils/toasts'

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
  enable: enablePush,
  disable: disablePush,
  enabled: pushEnabled,
  pending: pushPending,
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

// TODO: not sure if this works regarding reactivity...
const pwaPrompt = getPwaInstallPrompt()
</script>

<style scoped lang="sass">
@import '~editbox'

</style>
