<template>
  <div>
    <div
      v-if="activity.dateGroupedHeadline"
      class="q-px-sm q-pt-lg full-width date-grouped-headline"
    >
      {{ activity.dateGroupedHeadline }}
    </div>
    <QCard
      :class="{ full: activity.isFull }"
    >
      <QCardSection
        class="no-padding content"
        :class="{ isEmpty: activity.isEmpty, isUserMember: activity.isUserMember, isDisabled: activity.isDisabled }"
      >
        <div class="content-inner">
          <div class="row no-wrap items-start justify-between">
            <div>
              <strong class="featured-text">
                {{ $d(activity.date, 'hourMinute') }}
                <template v-if="activity.hasDuration"> &mdash; {{ $d(activity.dateEnd, 'hourMinute') }}</template>
              </strong>
              <template v-if="placeLink">
                <span v-if="activity.place">
                  <RouterLink :to="{ name: 'place', params: { placeId: activity.place.id }}">
                    {{ activity.place.name }}
                  </RouterLink>
                </span>
              </template>
              <template v-else>
                {{ $d(activity.date, 'dateLongWithDayName') }}
              </template>
            </div>
            <QIcon
              v-if="activity.activityType"
              v-bind="activity.activityType.iconProps"
              title=""
              size="xs"
              class="q-ml-sm"
              style="top: 1px;"
            >
              <q-tooltip v-if="activity.activityType.iconProps && activity.activityType.iconProps.title">
                {{ activity.activityType.iconProps.title }}
              </q-tooltip>
            </QIcon>
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
          <div class="q-mt-sm q-mb-none full-width">
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
      <QCardSection
        :class="{ 'justify-end': !$q.platform.is.mobile }"
        class="row no-padding full-width conversation-section"
      >
        <QBtn
          flat
          no-caps
          align="between"
          color="secondary"
          :class="{ 'full-width': $q.platform.is.mobile }"
          class="open-conversation-button"
          @click.native.stop="detail"
        >
          <template #default>
            <div>
              <QIcon
                name="chat"
                size="xs"
                class="q-mr-xs icon-left"
              />
              <span>{{ $t('CONVERSATION.OPEN') }}</span>
            </div>
            <QIcon
              name="chevron_right"
              :class="{ 'q-ml-sm': !$q.platform.is.mobile }"
              class="icon-right"
            />
          </template>
        </QBtn>
      </QCardSection>
    </QCard>
  </div>
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
      this.$emit('detail', this.activity)
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.date-grouped-headline
  font-weight 700
  color rgba(0, 0, 0, 0.7)
  text-align center

.content
  width 100%
  transition background-color 2s ease

  &.isUserMember
    &:not(.isDisabled)
      background linear-gradient(to right, $lightGreen, $lighterGreen)

  &.isDisabled
    background $lightRed

  .content-inner
    width 100%
    padding 12px

    .featured-text
      display inline
      margin-right .3em

.conversation-section
  font-weight 500
  color $secondary
  box-shadow 0 -1px 0 rgba(0, 0, 0, 0.06)

.q-btn.open-conversation-button
  ::v-deep .q-btn__wrapper
    padding 10px 12px !important

    .icon-left
      transform rotateY(180deg)

    .icon-right
      margin-right -6px
      font-size 24px
</style>
