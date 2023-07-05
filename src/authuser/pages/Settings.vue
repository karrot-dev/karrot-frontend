<template>
  <component
    :is="$q.platform.is.mobile ? 'div' : QCard"
    class="bg-grey-1"
  >
    <template
      v-if="user"
    >
      <div class="edit-box">
        <div class="text-h5 text-primary q-mb-lg">
          {{ $t('USERDATA.PHOTO') }}
        </div>
        <QField borderless>
          <template #before>
            <QIcon name="fas fa-camera" />
          </template>
          <template #control>
            <ChooseImage
              :image-url="user?.photoUrls?.fullSize"
              :on-change="({ image }) => saveUser({ id: user.id, photo: image })"
              :title="$t('USERDATA.SET_PHOTO')"
              :dialog-title="$t('USERDATA.SET_PHOTO')"
            />
          </template>
        </QField>
      </div>
      <QSeparator />
      <ProfileEdit
        :value="user"
        :status="profileEditStatus"
        :default-map-center="defaultMapCenter"
        @save="saveUser"
      />
      <QSeparator />
      <div class="edit-box">
        <div class="text-h5 text-primary q-mb-lg">
          {{ $t('LANGUAGECHOOSER.SWITCH') }}
        </div>
        <div class="row justify-end">
          <LocaleSelect class="q-my-lg" />
        </div>
      </div>
      <QSeparator />
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
      <QSeparator />
      <div class="edit-box">
        <div class="text-h5 text-primary q-mb-lg">
          {{ $t('USERDATA.ACCOUNT') }}
        </div>
        <div class="row justify-end">
          <RequestDeleteAccount
            :status="requestDeleteAccountStatus"
            @request-delete-account="requestDeleteAccount"
          />
        </div>
      </div>
      <QSeparator />
      <GroupSettings />
      <template v-if="pushIsSupported">
        <QSeparator />
        <div
          class="edit-box"
        >
          <div class="text-h5 text-primary q-mb-lg">
            {{ $t('USERDATA.PUSH') }}
          </div>
          <Push class="q-ma-lg" />
        </div>
      </template>
      <template
        v-if="hasPwaInstallPrompt()"
      >
        <QSeparator />
        <div class="edit-box">
          <div class="text-h5 text-primary q-mb-lg">
            {{ $t('USERDATA.APP') }}
          </div>
          <InstallPwa class="q-ma-lg" />
        </div>
      </template>
    </template>
  </component>
</template>

<script setup>
import {
  QCardSection,
  QSeparator,
  QCardActions,
  QField,
  QIcon,
  QCard,
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
import ChooseImage from '@/utils/components/ChooseImage.vue'
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
