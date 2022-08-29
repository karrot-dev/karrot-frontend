<template>
  <QCard class="activity-item">
    <QCardSection
      class="no-padding content"
      :class="{ isUserMember, isDisabled: activity.isDisabled }"
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
          <QIcon
            v-if="activity.activityType"
            v-bind="activityTypeIconProps"
            title=""
            size="xs"
            class="q-ml-sm"
            style="top: 1px;"
          >
            <QTooltip v-if="activityTypeIconProps && activityTypeIconProps.title">
              {{ activityTypeIconProps.title }}
            </QTooltip>
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
        <div class="q-mt-none q-mb-none full-width column q-gutter-y-md">
          <div
            v-for="participantType in participantTypes"
            :key="participantType.id"
            class="col"
            :class="[participantTypes.length > 1 ? 'multiple-types' : '', participantType.isUserParticipant ? 'active' : '']"
          >
            <Markdown
              v-if="participantType.description"
              :source="participantType.description"
            />
            <ActivityUsers
              :activity="activity"
              :participant-type="participantType"
            />
            <div
              v-if="participantTypes.length > 1 || participantType.role !== 'member'"
              class="q-my-xs"
            >
              <em>Open for <strong>{{ roleName(participantType.role) }}</strong></em>
            </div>
          </div>
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
              <template v-if="participantTypes.length > 1">
                <QItem
                  v-for="participantType in participantTypes"
                  :key="participantType.role"
                  tag="label"
                  :class="!roles.includes(participantType.role) || getIsFull(activity, participantType) ? 'text-grey-5' : ''"
                >
                  <QItemSection avatar>
                    <QRadio
                      v-model="joinParticipantTypeId"
                      :val="participantType.id"
                      color="orange"
                      :disable="!roles.includes(participantType.role) || getIsFull(activity, participantType)"
                    />
                  </QItemSection>
                  <QItemSection>
                    <QItemLabel>
                      <Markdown
                        v-if="participantType.description"
                        :source="participantType.description"
                      />
                    </QItemLabel>
                    <QItemLabel>
                      <em>Open for <strong>{{ roleName(participantType.role) }}</strong></em>
                    </QItemLabel>
                  </QItemSection>
                </QItem>
                <br>
              </template>
              <template v-else-if="onlyAvailableParticipantType">
                <Markdown
                  v-if="onlyAvailableParticipantType.description"
                  :source="onlyAvailableParticipantType.description"
                />
              </template>
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
                @click="joinActivity({ activityId: activity.id, participantTypeId: joinParticipantTypeId })"
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
        v-if="canJoin"
        flat
        no-caps
        :color="activityTypeIconProps.color"
        class="action-button"
        :loading="isJoining"
        @click="join"
      >
        <QIcon
          name="fas fa-user-plus"
          size="xs"
          class="q-mr-sm"
        />
        <span class="block">Join {{ activityTypeTranslatedName }}</span>
      </QBtn>
      <QBtn
        v-if="canLeave"
        flat
        no-caps
        color="red-4"
        class="action-button activity-hover"
        :loading="isLeaving"
        @click="leave"
      >
        <QIcon
          name="fas fa-user-times"
          size="xs"
          class="q-mr-sm"
        />
        <span class="block">Leave {{ activityTypeTranslatedName }}</span>
      </QBtn>
      <QSpace />
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
import {
  QCard,
  QCardSection,
  QIcon,
  QBtn,
  QSpace,
  QItem,
  QItemSection,
  QItemLabel,
  QRadio,
  QTooltip,
} from 'quasar'
import { computed, toRefs } from 'vue'

import { useActivityHelpers, useActivityTypeHelpers } from '@/activities/helpers'
import { useJoinActivityMutation, useLeaveActivityMutation } from '@/activities/mutations'
import { useActivityTypeService } from '@/activities/services'
import { useCurrentGroupService } from '@/group/services'
import { useDetailService } from '@/messages/services'
import { usePlaceService } from '@/places/services'
import { absoluteURL } from '@/utils/absoluteURL'

import CustomDialog from '@/utils/components/CustomDialog'
import Markdown from '@/utils/components/Markdown'

import ActivityUsers from './ActivityUsers'

export default {
  components: {
    CustomDialog,
    QCard,
    QCardSection,
    QIcon,
    QBtn,
    QSpace,
    QItem,
    QItemSection,
    QItemLabel,
    QRadio,
    QTooltip,
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
  setup (props) {
    const { activity } = toRefs(props)

    const { roles } = useCurrentGroupService()

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
      getIsFull,
    } = useActivityHelpers()

    const {
      getTranslatedName,
      getIconProps,
    } = useActivityTypeHelpers()

    const hasStarted = computed(() => getHasStarted(activity.value))
    const isUserMember = computed(() => getIsUserMember(activity.value))

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
      roles,

      activityTypeTranslatedName,
      activityTypeIconProps,

      isUserMember,
      hasStarted,
      getIsFull,

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
      joinParticipantTypeId: null,
    }
  },
  computed: {
    canJoin () {
      if (this.activity.isDisabled || this.isUserMember) {
        return false
      }
      return this.availableParticipantTypes.length > 0
    },
    canLeave () {
      return this.isUserMember
    },
    participantTypes () {
      return this.activity.participantTypes.filter(entry => !entry._removed)
    },
    availableParticipantTypes () {
      return this.participantTypes.filter(participantType => {
        return this.roles.includes(participantType.role) && !this.getIsFull(this.activity, participantType)
      })
    },
    onlyAvailableParticipantType () {
      if (this.availableParticipantTypes.length === 1) {
        return this.availableParticipantTypes[0]
      }
      return null
    },
    icsUrl () {
      // a relative URL would work fine in a browser but
      // not in Cordova so we always make it absolute for simplicity.
      // see https://github.com/karrot-dev/karrot-frontend/issues/2400
      return absoluteURL(`/api/activities/${this.activity.id}/ics/`)
    },
  },
  methods: {
    join () {
      if (this.joinParticipantTypeId !== null && !this.availableParticipantTypes.find(t => t.id === this.joinParticipantTypeId)) {
        this.joinParticipantTypeId = null
      }
      if (this.joinParticipantTypeId === null && this.availableParticipantTypes.length > 0) {
        this.joinParticipantTypeId = this.availableParticipantTypes[0].id
      }
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
      this.openActivity(this.activity)
    },
    roleName (role) {
      return role === 'member' ? 'anyone' : role // TODO: translation
    },
  },
}
</script>

<style scoped lang="sass">
.activity-item
  .activity-hover
    visibility: hidden

  &:hover
    .activity-hover
      visibility: visible

.multiple-types
  padding: 8px 8px 2px 8px
  border-left: 4px solid rgba(0, 0, 0, 0.1)
  &.active
   background-color: rgba(0, 0, 0, 0.1)

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
