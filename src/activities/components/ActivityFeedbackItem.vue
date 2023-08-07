<template>
  <QCard>
    <div
      v-if="bannerImageURL"
      style="height: 50px;"
      class="relative-position overflow-hidden-y"
    >
      <QImg
        :src="bannerImageURL"
        class="absolute-center"
      />
    </div>
    <QCardSection
      v-if="activityType"
      :style="{ backgroundColor: lighten(activityType.colour, 80) }"
    >
      <div class="row">
        <QIcon
          v-bind="activityTypeIconProps"
          :color="activityTypeIconProps.color"
          size="xs"
          class="q-mr-sm"
        />
        <div>
          {{ activityTypeTranslatedName }}
          at
          <span v-if="place">
            <RouterLink
              :to="{ name: 'place', params: { groupId: place.group, placeId: place.id }}"
              :class="`text-${activityTypeIconProps.color}`"
            >
              {{ place.name }}
            </RouterLink>
          </span>
        </div>
      </div>
    </QCardSection>
    <QCardSection
      class="no-padding content"
      :class="{ isUserParticipant, isDisabled: activity.isDisabled }"
    >
      <div class="content-inner">
        <div class="row no-wrap items-start justify-between">
          <div>
            <strong class="featured-text">
              {{ $d(activity.date, 'hourMinute') }}
              <template v-if="activity.hasDuration"> &mdash; {{ $d(activity.dateEnd, 'hourMinute') }}</template>
            </strong>
            <template v-if="placeLink">
              <template v-if="dense">
                <span>{{ $d(activity.date, 'dateWithDayName') }}</span>
                <br>
              </template>
              <span v-if="place">
                <RouterLink :to="{ name: 'place', params: { groupId: place.group, placeId: place.id }}">
                  {{ place.name }}
                </RouterLink>
              </span>
            </template>
            <template v-else>
              {{ $d(activity.date, 'dateLongWithDayName') }}
            </template>
          </div>
        </div>
        <ShowMore
          :height="200"
          :overlay-color="isUserParticipant ? '#E7FFE0' : 'white'"
        >
          <Markdown
            v-if="activity.description"
            :source="activity.description"
            mentions
          />
        </ShowMore>
      </div>
    </QCardSection>
    <QCardSection class="q-pa-none">
      <div class="row">
        <div class="col">
          <template
            v-for="{ user, feedback } in feedbackAndUsers"
            :key="user.id"
          >
            <QItem>
              <QItemSection avatar>
                <ProfilePicture
                  :user="user"
                  :size="32"
                />
              </QItemSection>
              <QItemSection>
                <QItemLabel class="text-bold">
                  <RouterLink :to="{name: 'user', params: { userId: user.id }}">
                    {{ user.displayName }}
                  </RouterLink>
                </QItemLabel>
                <QItemLabel
                  v-if="feedback"
                  caption
                >
                  <div
                    class="caption-items"
                  >
                    <strong v-if="feedback.weight > 0">
                      {{ formatFeedbackWeight(feedback.weight).join('') }}
                    </strong>
                    <DateAsWords
                      :date="feedback.createdAt"
                      :future="false"
                    />
                    <RouterLink
                      v-if="place && feedback.isEditable"
                      :to="{ name: 'editFeedback', params: { groupId: place.group, feedbackId: feedback.id }}"
                    >
                      <QIcon
                        name="fas fa-pencil-alt"
                        :title="$t('BUTTON.EDIT')"
                      />
                    </RouterLink>
                  </div>
                </QItemLabel>
                <QItemLabel
                  v-else
                  caption
                  class="text-italic"
                >
                  This participant has not posted feedback
                </QItemLabel>
              </QItemSection>
            </QItem>
            <QCardSection v-if="feedback?.comment">
              <div class="comment">
                <Markdown :source="feedback.comment" />
              </div>
            </QCardSection>
          </template>
        </div>
        <div class="col-auto">
          <AmountBox
            v-if="hasFeedbackWeight"
            :size="80"
            class="q-ma-md"
            :amount="feedbackWeight"
          />
        </div>
      </div>
    </QCardSection>
    <QCardSection
      class="row no-padding full-width justify-end bottom-actions"
    >
      <QBtn
        v-if="activity.isPublic"
        class="action-button"
        flat
        no-caps
        :to="{ name: 'publicActivity', params: { activityPublicId: activity.publicId } }"
        :padding="$q.platform.is.mobile ? '4px' : undefined"
      >
        <QIcon
          name="fas fa-globe"
          size="xs"
          class="q-mr-sm"
        />
        <span v-if="!$q.platform.is.mobile">{{ $t('ACTIVITYLIST.PUBLIC.VIEW') }}</span>
      </QBtn>
      <QSpace />
      <QBtn
        flat
        no-caps
        color="secondary"
        class="action-button"
        @click.stop="detail"
      >
        <template #default>
          <QIcon
            name="chat"
            size="xs"
            class="q-mr-xs icon-chat"
          />
          <span class="block">{{ $t('CONVERSATION.OPEN') }}</span>
        </template>
      </QBtn>
    </QCardSection>
  </QCard>
</template>

<script setup>
import {
  QCard,
  QCardSection,
  QIcon,
  QBtn,
  QSpace,
  QItem,
  QItemSection,
  QItemLabel,
  QImg,
  colors,
} from 'quasar'
import { computed, toRefs } from 'vue'

import { useActivityHelpers, useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import { useFeedbackHelpers } from '@/feedback/helpers'
import { useDetailService } from '@/messages/services'
import { usePlaceService } from '@/places/services'
import { useUserService } from '@/users/services'
import { absoluteURL } from '@/utils/absoluteURL'

import ActivityItemFeedback from '@/activities/components/ActivityItemFeedback.vue'
import AmountBox from '@/feedback/components/AmountBox.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'
import CustomDialog from '@/utils/components/CustomDialog.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'
import Markdown from '@/utils/components/Markdown.vue'
import ShowMore from '@/utils/components/ShowMore.vue'

import ActivityEditButton from './ActivityEditButton.vue'
import ActivityUsers from './ActivityUsers.vue'

const { lighten } = colors

const props = defineProps({
  activity: {
    type: Object,
    required: true,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  placeLink: {
    type: Boolean,
    default: false,
  },
  preview: {
    type: Boolean,
    default: false,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
})

const { activity } = toRefs(props)

const {
  getActivityTypeById,
} = useActivityTypeService()

const {
  getPlaceById,
} = usePlaceService()

const {
  openActivity,
} = useDetailService()

const { getUserById } = useUserService()

const {
  getIsUserParticipant,
} = useActivityHelpers()

const {
  getTranslatedName,
  getIconProps,
} = useActivityTypeHelpers()

const isUserParticipant = computed(() => getIsUserParticipant(activity.value))

const place = computed(() => getPlaceById(activity.value.place))

const activityType = computed(() => getActivityTypeById(activity.value.activityType))
const activityTypeTranslatedName = computed(() => getTranslatedName(activityType.value))
const activityTypeIconProps = computed(() => getIconProps(activityType.value))

const bannerImageURL = computed(() => {
  return activity.value?.bannerImageUrls?.fullSize
})
function detail (event) {
  if (event.target.closest('a')) return // ignore actual links
  !props.preview && openActivity(activity.value)
}

const { formatFeedbackWeight } = useFeedbackHelpers()

const feedbackAndUsers = computed(() => {
  if (!activity.value || !activity.value.feedback) return []
  // first ones that have given feedback
  const entries = activity.value.feedback.map(feedback => ({
    feedback,
    user: getUserById(feedback.givenBy),
  }))

  return [
    ...entries,
    ...usersThatHaveNotGivenFeedback.value.map(user => ({
      feedback: null,
      user,
    })),
  ]
})

const hasFeedbackWeight = computed(() => activityType.value?.hasFeedbackWeight)
const feedbackWeight = computed(() => {
  if (!hasFeedbackWeight.value) return 0
  return activity.value?.feedback.reduce((total, feedback) => total + feedback.weight, 0)
})

// users that have not given feedback
const usersThatHaveNotGivenFeedback = computed(() => {
  const userIds = new Set(activity.value.participants.map(p => p.user))
  for (const feedback of activity.value.feedback) {
    userIds.delete(feedback.givenBy)
  }
  return Array.from(userIds).map(getUserById)
})

</script>

<style scoped lang="sass">

.caption-items
  > *
    display: inline
  > *::after
    content: '/'
    padding: 0 6px
    color: #ccc
  > *:last-child::after
    display: none
  .q-icon
    // quasar makes it "middle" which puts it a bit low here...
    vertical-align: baseline

// TODO: the style from here below is duplicated from ActivityItem.vue
.multiple-types
  padding: 8px 8px 2px 8px
  border-left: 4px solid rgba(0, 0, 0, 0.1)
  &.active
   background-color: rgba(0, 0, 0, 0.1)

.content
  width: 100%

  &.isUserParticipant
    &:not(.isDisabled)
      background-color: $lightGreen

  &.isDisabled
    background: $lightRed

  .content-inner
    width: 100%
    padding: 12px

    .featured-text
      display: inline
      margin-right: .3em

.bottom-actions
  font-weight: 500
  color: $secondary
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.06)

.q-btn.action-button
  ::v-deep(.q-btn__wrapper)
    padding: 10px 16px !important

    .icon-chat
      transform: rotateY(180deg)
</style>
