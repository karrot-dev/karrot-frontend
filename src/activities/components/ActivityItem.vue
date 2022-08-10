<template>
  <QCard
    :class="{ full: isFull }"
  >
    <QCardSection
      class="no-padding content"
      :class="{ isEmpty: isEmpty, isUserMember: isUserMember, isDisabled: activity.isDisabled }"
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
                <RouterLink :to="{ name: 'place', params: { placeId: place.id }}">
                  {{ place.name }}
                </RouterLink>
              </span>
            </template>
            <template v-else>
              {{ $d(activity.date, 'dateLongWithDayName') }}
            </template>
          </div>
          <QIcon
            v-if="activity.activityType"
            v-bind="activityTypeIconProps"
            title=""
            size="xs"
            class="q-ml-sm"
            style="top: 1px;"
          >
            <q-tooltip v-if="activityTypeIconProps && activityTypeIconProps.title">
              {{ activityTypeIconProps.title }}
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
          v-if="hasStarted"
          class="q-my-xs"
        >
          <b class="text-orange">{{ $t('ACTIVITYLIST.ACTIVITY_STARTED') }}</b>
        </div>
        <Markdown
          v-if="activity.description"
          :source="activity.description"
          mentions
        />
        <div class="q-mt-sm q-mb-none full-width">
          <ActivityUsers
            :activity="activity"
            :is-joining="isJoining"
            :is-leaving="isLeaving"
            @leave="leave"
            @join="join"
          />
          <CustomDialog v-model="joinDialog">
            <template #title>
              <QIcon
                v-bind="activityTypeIconProps"
                size="sm"
                class="q-pr-sm"
              />
              {{ $t('ACTIVITYLIST.ITEM.JOIN_CONFIRMATION_HEADER', { activityType: activityTypeTranslatedName }) }}
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
                @click="joinActivity(activity.id)"
              />
            </template>
          </CustomDialog>
          <CustomDialog v-model="leaveDialog">
            <template #title>
              <QIcon
                v-bind="activityTypeIconProps"
                size="sm"
                class="q-pr-sm"
              />
              {{ $t('ACTIVITYLIST.ITEM.LEAVE_CONFIRMATION_HEADER', { activityType: activityTypeTranslatedName }) }}
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
                @click="leaveActivity(activity.id)"
              />
            </template>
          </CustomDialog>
        </div>
      </div>
    </QCardSection>
    <QCardSection
      class="row no-padding full-width justify-end bottom-actions"
    >
      <QBtn
        v-if="isUserMember"
        :href="icsUrl"
        flat
        no-caps
        type="a"
        color="secondary"
        class="action-button"
      >
        <template #default>
          <QIcon
            name="event"
            size="xs"
            class="q-mr-xs"
          />
          <span>{{ $t('ACTIVITYLIST.ITEM.DOWNLOAD_ICS') }}</span>
        </template>
      </QBtn>
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

<script>
import { computed, toRefs } from 'vue'
import {
  QCard,
  QCardSection,
  QIcon,
  QBtn,
} from 'quasar'
import ActivityUsers from './ActivityUsers'
import CustomDialog from '@/utils/components/CustomDialog'
import { absoluteURL } from '@/utils/absoluteURL'
import Markdown from '@/utils/components/Markdown'
import { useJoinActivityMutation, useLeaveActivityMutation } from '@/activities/mutations'
import { useActivityHelpers, useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import { usePlaceService } from '@/places/services'
import { useDetailService } from '@/messages/services'

export default {
  components: {
    CustomDialog,
    QCard,
    QCardSection,
    QIcon,
    QBtn,
    ActivityUsers,
    Markdown,
  },
  props: {
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
  },
  emits: [
    'detail',
  ],
  setup (props) {
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

    const {
      getIsUserMember,
      getHasStarted,
      getIsEmpty,
      getIsFull,
    } = useActivityHelpers()

    const {
      getTranslatedName,
      getIconProps,
    } = useActivityTypeHelpers()

    const hasStarted = computed(() => getHasStarted(activity.value))
    const isUserMember = computed(() => getIsUserMember(activity.value))
    const isEmpty = computed(() => getIsEmpty(activity.value))
    const isFull = computed(() => getIsFull(activity.value))

    const place = computed(() => getPlaceById(activity.value.place))

    const activityType = computed(() => getActivityTypeById(activity.value.activityType))
    const activityTypeTranslatedName = computed(() => getTranslatedName(activityType.value))
    const activityTypeIconProps = computed(() => getIconProps(activityType.value))

    const {
      mutate: joinActivity,
      isLoading: isJoining,
    } = useJoinActivityMutation()

    const {
      mutate: leaveActivity,
      isLoading: isLeaving,
    } = useLeaveActivityMutation()

    return {
      place,

      activityTypeTranslatedName,
      activityTypeIconProps,

      isUserMember,
      hasStarted,
      isEmpty,
      isFull,

      joinActivity,
      isJoining,
      leaveActivity,
      isLeaving,

      openActivity,
    }
  },
  data () {
    return {
      joinDialog: false,
      leaveDialog: false,
    }
  },
  computed: {
    icsUrl () {
      // a relative URL would work fine in a browser but
      // not in Cordova so we always make it absolute for simplicity.
      // see https://github.com/karrot-dev/karrot-frontend/issues/2400
      return absoluteURL(`/api/activities/${this.activity.id}/ics/`)
    },
  },
  methods: {
    join () {
      this.leaveDialog = false
      this.joinDialog = true
    },
    leave () {
      if (!this.hasStarted) {
        this.joinDialog = false
        this.leaveDialog = true
      }
    },
    detail (event) {
      if (event.target.closest('a')) return // ignore actual links
      // this.$emit('detail', this.activity)
      this.openActivity(this.activity.id)
    },
  },
}
</script>

<style scoped lang="sass">
.content
  width: 100%
  transition: background-color 2s ease

  &.isUserMember
    &:not(.isDisabled)
      background: linear-gradient(to right, $lightGreen, $lighterGreen)

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
