<template>
  <QCard
    :class="{ full: activity.isFull }"
    @click.native.stop="detail"
  >
    <QCardSection
      class="no-padding content"
      :class="{ isEmpty: activity.isEmpty, isUserMember: activity.isUserMember, isDisabled: activity.isDisabled }"
    >
      <div class="q-pa-sm full-width">
        <div>
          <QIcon
            v-if="activity.activityType"
            v-bind="activity.activityType.iconProps"
            size="xs"
            class="q-pr-xs"
            style="position: relative; bottom: 4px;"
          />
          <span class="featured-text">
            {{ $d(activity.date, 'hourMinute') }}
            <template v-if="activity.hasDuration"> &mdash; {{ $d(activity.dateEnd, 'hourMinute') }}</template>
          </span>
          <template v-if="placeLink">
            <strong v-if="activity.place">
              <RouterLink :to="{ name: 'place', params: { placeId: activity.place.id }}">
                {{ activity.place.name }}
              </RouterLink>
            </strong> {{ $d(activity.date, 'dateWithDayName') }}
          </template>
          <template v-else>
            {{ $d(activity.date, 'dateLongWithDayName') }}
          </template>
          <span>
            <strong>{{ $t('CONVERSATION.OPEN') }} <QIcon name="chat" /></strong>
          </span>
        </div>
        <div
          v-if="activity.isDisabled"
          class="q-my-xs"
        >
          <b class="text-negative">{{ $t('ACTIVITYLIST.ACTIVITY_DISABLED') }}</b>
        </div>
        <div
          v-if="activity.hasStarted"
          class="q-my-xs"
        >
          <b class="text-orange">{{ $t('ACTIVITYLIST.ACTIVITY_STARTED') }}</b>
        </div>
        <!-- eslint-disable vue/multiline-html-element-content-newline -->
        <div
          v-if="activity.description"
          class="q-my-xs multiline"
        >{{ activity.description }}</div>
        <!-- eslint-enable vue/multiline-html-element-content-newline -->
        <div class="q-my-xs full-width">
          <ActivityUsers
            :activity="activity"
            @leave="leave"
            @join="join"
          />
          <CustomDialog v-model="joinDialog">
            <template #title>
              <QIcon
                v-bind="activity.activityType.iconProps"
                size="sm"
                class="q-pr-sm"
              />
              {{ $t('ACTIVITYLIST.ITEM.JOIN_CONFIRMATION_HEADER', { activityType: activity.activityType.translatedName }) }}
            </template>
            <template #message>
              {{ $t('ACTIVITYLIST.ITEM.JOIN_CONFIRMATION_TEXT', { date: $d(activity.date, 'long') }) }}
            </template>
            <template #actions>
              <QBtn
                v-close-popup
                flat
                color="primary"
                :label="$t('BUTTON.CANCEL')"
              />
              <QBtn
                v-close-popup
                flat
                color="primary"
                data-autofocus
                :label="$t('BUTTON.OF_COURSE')"
                @click="$emit('join', activity.id)"
              />
            </template>
          </CustomDialog>
          <CustomDialog v-model="leaveDialog">
            <template #title>
              <QIcon
                v-bind="activity.activityType.iconProps"
                size="sm"
                class="q-pr-sm"
              />
              {{ $t('ACTIVITYLIST.ITEM.LEAVE_CONFIRMATION_HEADER', { activityType: activity.activityType.translatedName }) }}
            </template>
            <template #message>
              {{ $t('ACTIVITYLIST.ITEM.LEAVE_CONFIRMATION_TEXT') }}
            </template>
            <template #actions>
              <QBtn
                v-close-popup
                flat
                color="primary"
                :label="$t('BUTTON.CANCEL')"
              />
              <QBtn
                v-close-popup
                flat
                color="primary"
                data-autofocus
                :label="$t('BUTTON.YES')"
                @click="$emit('leave', activity.id)"
              />
            </template>
          </CustomDialog>
        </div>
      </div>
    </QCardSection>
  </QCard>
</template>

<script>
import {
  QCard,
  QCardSection,
  QIcon,
  QBtn,
} from 'quasar'
import ActivityUsers from './ActivityUsers'
import CustomDialog from '@/activities/components/CustomDialog'

export default {
  components: {
    CustomDialog,
    QCard,
    QCardSection,
    QIcon,
    QBtn,
    ActivityUsers,
  },
  props: {
    activity: {
      type: Object,
      required: true,
    },
    placeLink: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      joinDialog: false,
      leaveDialog: false,
    }
  },
  methods: {
    join () {
      this.leaveDialog = false
      this.joinDialog = true
    },
    leave () {
      if (!this.activity.hasStarted) {
        this.joinDialog = false
        this.leaveDialog = true
      }
    },
    detail (event) {
      if (event.target.closest('a')) return // ignore actual links
      if (event.target.classList.contains('user-slot-wrapper')) return // ignore actual links
      this.$emit('detail', this.activity)
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.content
  width 100%
  font-size .8em
  cursor pointer
  transition background-color 2s ease

  .featured-text
    display inline
    margin-right .3em
    font-size 1.5em

  &.isEmpty:not(.isDisabled)
    background repeating-linear-gradient(
      135deg,
      white,
      white 15px,
      $lightRed 15px,
      $lightRed 30px
    )

  &.isUserMember
    &:not(.isDisabled)
      background linear-gradient(to right, $lightGreen, $lighterGreen)

  &.isDisabled
    background $lightRed
</style>
