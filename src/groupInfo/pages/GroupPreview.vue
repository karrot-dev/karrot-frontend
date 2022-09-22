<template>
  <div v-if="group">
    <QCard class="shadow-6">
      <div
        class="photo text-white relative-position row justify-center"
        :class="{ hasPhoto: group.photoUrls['600'] }"
      >
        <img
          v-if="group.photoUrls['600']"
          :src="group.photoUrls['600']"
        >
        <RandomArt
          v-else
          :seed="group.id"
          type="circles"
          class="full-height"
        />
        <div class="absolute-bottom k-media-overlay q-pa-md">
          <div
            class="ellipsis"
          >
            <span
              v-measure
              class="row group items-start text-h6"
            >
              {{ group.name }}
              <QIcon
                v-if="group.status === 'playground'"
                name="fas fa-child"
              />
            </span>
            <span class="text-subtitle2">
              {{ group.memberCount }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.memberCount) }}
            </span>
          </div>
        </div>
      </div>
      <QCardSection>
        <div
          v-if="group.publicDescription"
        >
          <Markdown :source="group.publicDescription" />
        </div>
        <span
          v-else
          class="text-italic"
        >
          {{ $t('JOINGROUP.NO_PUBLIC_DESCRIPTION') }}
        </span>
      </QCardSection>
      <QSeparator />
      <QCardActions
        :class="application ? 'bg-blue text-white' : ''"
      >
        <div style="width: 100%">
          <template v-if="group.memberCount === 0 && !application">
            <QBanner class="bg-info">
              {{ $t('JOINGROUP.ARCHIVED_NOTE' ) }}
              <template #avatar>
                <QIcon
                  name="info"
                  style="font-size: 24px"
                />
              </template>
            </QBanner>
          </template>
          <template v-else-if="isLoggedIn">
            <template v-if="!group.isMember">
              <QBanner
                v-if="!application"
                class="bg-info"
              >
                {{ $t('JOINGROUP.PROFILE_NOTE' ) }}
                <template #avatar>
                  <QIcon
                    name="info"
                    style="font-size: 24px"
                  />
                </template>
              </QBanner>
              <div
                v-if="application"
                class="row q-pa-xs q-gutter-md"
              >
                <div class="col-sm-grow col-xs-12 self-center">
                  <QIcon
                    name="info"
                    color="white"
                    style="font-size: 24px"
                  />
                  {{ $t('JOINGROUP.APPLICATION_PENDING' ) }}
                </div>
                <QBtn
                  class="col-auto col-xs-grow"
                  flat
                  dense
                  :label="$t('BUTTON.OPEN')"
                  icon="fas fa-fw fa-comments"
                  @click="openApplication(application)"
                />
                <QBtn
                  class="col-auto col-xs-grow"
                  flat
                  dense
                  :label="$t('BUTTON.WITHDRAW')"
                  icon="fas fa-fw fa-trash-alt"
                  @click="withdraw"
                />
              </div>
              <QBtn
                v-if="user && !user.mailVerified"
                color="secondary"
                class="float-right q-ma-xs"
                :to="{ name: 'settings', hash: '#change-email' }"
              >
                {{ $t('JOINGROUP.VERIFY_EMAIL_ADDRESS') }}
              </QBtn>
              <QBtn
                v-if="user && user.mailVerified && !application"
                color="secondary"
                class="float-right q-ma-xs"
                :to="{ name: 'applicationForm', params: { groupPreviewId: group.id } }"
              >
                {{ $t('BUTTON.APPLY') }}
              </QBtn>
            </template>
            <QBtn
              v-else
              flat
              :label="$t('BUTTON.OPEN')"
              icon="fas fa-home"
              :to="{ name: 'group', params: { groupId: group.id } }"
            >
              <QTooltip>
                {{ $t('GROUPINFO.MEMBER_VIEW') }}
              </QTooltip>
            </QBtn>
          </template>

          <QBtn
            v-else
            color="secondary"
            class="float-right q-ma-xs"
            :to="{ name: 'signup' }"
          >
            {{ $t('JOINGROUP.SIGNUP_OR_LOGIN') }}
          </QBtn>
        </div>
      </QCardActions>
      <template v-if="publicActivities.length > 0">
        <QSeparator />
        <QInfiniteScroll v-bind="infiniteScroll">
          <QCardSection
            class="row public-activities"
          >
            <div
              v-for="publicActivity in publicActivities"
              :key="publicActivity.publicId"
              class="col-12 col-sm-4 smaller-text"
            >
              <QCard
                v-ripple
                flat
                bordered
                class="cursor-pointer q-hoverable"
                @click="$router.push({ name: 'publicActivity', params: { activityPublicId: publicActivity.publicId } })"
              >
                <QImg
                  v-if="publicActivity.bannerImageUrls?.fullSize"
                  :src="publicActivity.bannerImageUrls.fullSize"
                  class="full-width"
                />
                <QCardSection>
                  <span
                    :style="{ color: '#' + publicActivity.activityType.colour }"
                  >
                    <QIcon
                      v-bind="getIconProps(publicActivity.activityType)"
                      class="q-pr-xs"
                    />
                  </span>
                  {{ $d(publicActivity.date, 'shortDateAndTime') }}
                  <Markdown :source="publicActivity.description" />
                </QCardSection>
              </QCard>
            </div>
          </QCardSection>
        </QInfiniteScroll>
      </template>
    </QCard>
  </div>
</template>

<script setup>
import {
  Dialog,
  QTooltip,
  QCard,
  QCardSection,
  QSeparator,
  QCardActions,
  QBtn,
  QIcon,
  QBanner,
  QImg,
  QInfiniteScroll,
} from 'quasar'
import { computed, unref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { usePublicActivityListQuery } from '@/activities/queries'
import { useWithdrawApplicationMutation } from '@/applications/mutations'
import { useApplicationListQuery } from '@/applications/queries'
import { useAuthService } from '@/authuser/services'
import { useActiveGroupPreviewService } from '@/groupInfo/services'
import { useDetailService } from '@/messages/services'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'
import { showToast } from '@/utils/toasts'

import Markdown from '@/utils/components/Markdown'
import RandomArt from '@/utils/components/RandomArt'

const { openApplication } = useDetailService()
const { getIconProps } = useActivityTypeHelpers()

const { t } = useI18n()

const {
  userId,
  user,
  isLoggedIn,
} = useAuthService()

const {
  groupId: groupPreviewId,
  group,
} = useActiveGroupPreviewService()

const {
  mutateAsync: withdrawApplication,
} = useWithdrawApplicationMutation()

const {
  publicActivities,
  infiniteScroll,
} = usePublicActivityListQuery({
  groupId: groupPreviewId,
  dateMin: newDateRoundedTo5Minutes(),
})

// TODO add pending state, avoid flashing of content?
const {
  applications,
} = useApplicationListQuery({ userId, status: 'pending', isLoggedIn }, { keepPreviousData: true })

const application = computed(() => applications.value.find(a => a.group === unref(groupPreviewId)))

async function withdraw () {
  Dialog.create({
    title: t('JOINGROUP.WITHDRAW_CONFIRMATION_HEADER'),
    message: t('JOINGROUP.WITHDRAW_CONFIRMATION_TEXT', { groupName: group.value.name }),
    ok: t('BUTTON.YES'),
    cancel: t('BUTTON.CANCEL'),
  })
    .onOk(async () => {
      await withdrawApplication(application.value.id)
      showToast({
        message: 'JOINGROUP.APPLICATION_WITHDRAWN',
      })
    })
}
</script>

<style scoped lang="sass">
::v-deep(.q-banner__avatar)
  align-self: center

.q-card *
  overflow: hidden

.photo
  &.hasPhoto
    height: 350px

  &:not(.hasPhoto)
    height: 140px

  img
    width: auto
    max-width: 100%
    max-height: 100%
    margin: 0 auto

  .k-media-overlay
    background-color: rgba(0, 0, 0, 0.47)

.public-activities
  .q-card
    height: 220px
</style>
