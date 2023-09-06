<template>
  <QCard
    ref="itemRef"
    :class="{ highlight: isHighlighted }"
  >
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
      v-if="canGiveFeedback"
      class="bg-info no-padding"
    >
      <RouterLink
        :to="{ name: 'giveFeedback', params: { groupId: place.group, activityId: activity.id }}"
        class="block q-pa-md"
      >
        <QIcon
          v-bind="activityTypeFeedbackIconProps"
          color="black"
          class="q-mr-sm"
        />
        {{ t('ACTIVITY_FEEDBACK.YOU_CAN_GIVE_FEEDBACK') }}
      </RouterLink>
    </QCardSection>
    <QCardSection
      v-if="activityType"
      :style="{ backgroundColor: lighten(activityType.colour, 80) }"
    >
      <div class="row no-wrap">
        <QIcon
          v-bind="activityTypeIconProps"
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
    <QCardSection>
      <strong class="q-mr-xs">
        {{ $d(activity.date, 'hourMinute') }}
        <template v-if="activity.hasDuration"> &mdash; {{ $d(activity.dateEnd, 'hourMinute') }}</template>
      </strong>
      {{ $d(activity.date, 'dateLongWithDayName') }}
    </QCardSection>
    <QCardSection class="no-padding">
      <div class="column row-sm q-mb-md">
        <div
          v-if="hasFeedbackWeight && feedbackWeight > 0"
          class="col-shrink order-sm-last"
        >
          <AmountBox
            :size="80"
            class="q-ma-md"
            :amount="feedbackWeight"
          />
        </div>
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
                  v-else-if="hasDismissedFeedback(user)"
                  caption
                  class="text-italic"
                >
                  {{ t('ACTIVITY_FEEDBACK.DECLINED') }}
                </QItemLabel>
                <QItemLabel
                  v-else-if="getIsCurrentUser(user) && canGiveFeedback"
                  caption
                >
                  <RouterLink :to="{ name: 'giveFeedback', params: { groupId: place.group, activityId: activity.id }}">
                    {{ t('ACTIVITY_FEEDBACK.NOT_GIVEN_YOU') }}
                  </RouterLink>
                </QItemLabel>
                <QItemLabel
                  v-else
                  caption
                  class="text-italic"
                >
                  {{ t('ACTIVITY_FEEDBACK.NOT_GIVEN_YET') }}
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
      </div>
    </QCardSection>
    <QCardActions
      class="no-padding actions"
    >
      <QBtn
        v-if="activity.isPublic"
        flat
        no-caps
        :to="{ name: 'publicActivity', params: { activityPublicId: activity.publicId } }"
        :padding="$q.platform.is.mobile ? '4px' : '8px 16px'"
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
        :padding="$q.platform.is.mobile ? '4px' : '8px 16px'"
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
    </QCardActions>
  </QCard>
</template>

<script setup>
import addDays from 'date-fns/addDays'
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
  colors, QCardActions,
} from 'quasar'
import { computed, nextTick, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import { useAuthHelpers } from '@/authuser/helpers'
import { useAuthService } from '@/authuser/services'
import { useConfigQuery } from '@/base/queries'
import { useFeedbackHelpers } from '@/feedback/helpers'
import { useDetailService } from '@/messages/services'
import { usePlaceService } from '@/places/services'
import { useUserService } from '@/users/services'
import reactiveNow from '@/utils/reactiveNow'

import AmountBox from '@/feedback/components/AmountBox.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'
import Markdown from '@/utils/components/Markdown.vue'

const { lighten } = colors

const itemRef = ref(null)

const { t } = useI18n()

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
  highlightFeedback: {
    type: Number,
    default: null,
  },
})

const { activity, highlightFeedback } = toRefs(props)

const {
  getActivityTypeById,
} = useActivityTypeService()

const {
  getPlaceById,
} = usePlaceService()

const {
  openActivity,
} = useDetailService()

const { config } = useConfigQuery()

const { getUserById } = useUserService()

const { userId: currentUserId } = useAuthService()

const { getIsCurrentUser } = useAuthHelpers()

const {
  getTranslatedName,
  getIconProps,
  getFeedbackIconProps,
} = useActivityTypeHelpers()

const place = computed(() => getPlaceById(activity.value.place))

const activityType = computed(() => getActivityTypeById(activity.value.activityType))
const activityTypeTranslatedName = computed(() => getTranslatedName(activityType.value))
const activityTypeIconProps = computed(() => getIconProps(activityType.value))
const activityTypeFeedbackIconProps = computed(() => getFeedbackIconProps(activityType.value))

const bannerImageURL = computed(() => {
  return activity.value?.bannerImageUrls?.fullSize
})
function detail (event) {
  if (event.target.closest('a')) return // ignore actual links
  openActivity(activity.value)
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

const hasFeedback = computed(() => activityType.value?.hasFeedback)

const hasFeedbackWeight = computed(() => hasFeedback.value && activityType.value?.hasFeedbackWeight)

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

function hasDismissedFeedback (user) {
  return activity.value?.feedbackDismissedBy.includes(user.id)
}

const canGiveFeedback = computed(() => {
  return (
    // activity type supports feedback
    hasFeedback.value &&
    // they have not already given feedback
    usersThatHaveNotGivenFeedback?.value.some(user => user.id === currentUserId.value) &&
    // they haven't dismissed feedback
    !activity.value?.feedbackDismissedBy.includes(currentUserId.value) &&
    // it's within the correct range
    reactiveNow.value <= addDays(activity.value.dateEnd, config.value?.feedbackPossibleDays ?? 0)
  )
})

const isHighlighted = computed(() => {
  if (!hasFeedback.value || !highlightFeedback.value) return false
  return activity.value?.feedback.some(f => f.id === highlightFeedback.value)
})

watch(highlightFeedback, async value => {
  if (!value) return
  if (!(itemRef.value?.$el)) await nextTick() // wait for it be rendered if not available yet
  if (!(itemRef.value?.$el)) return // still not there, give up
  itemRef.value.$el.scrollIntoView()
}, { immediate: true })

</script>

<style scoped lang="sass">
@use 'sass:color'

.highlight
  border-color: $secondary
  box-shadow: color.change($secondary, $alpha: 0.3) 0px 0px 0px 3px

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

.actions
  color: $secondary
  border-top: 1px solid $grey-3
</style>
