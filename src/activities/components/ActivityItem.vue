<template>
  <QCard class="activity-item">
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
            :class="[participantTypes.length > 1 ? 'multiple-types' : '', getIsUserParticipant(activity, participantType) ? 'active' : '']"
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
              <i18n-t
                keypath="ACTIVITYLIST.OPEN_FOR_ROLE"
                tag="em"
              >
                <template #role>
                  <strong>{{ roleName(participantType.role) }}</strong>
                </template>
              </i18n-t>
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
                      <i18n-t
                        keypath="ACTIVITYLIST.OPEN_FOR_ROLE"
                        tag="em"
                      >
                        <template #role>
                          <strong>{{ roleName(participantType.role) }}</strong>
                        </template>
                      </i18n-t>
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
                @click="!preview && joinActivity({ activityId: activity.id, participantTypeId: joinParticipantTypeId })"
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
                @click="!preview && leaveActivity(activity.id)"
              />
            </template>
          </CustomDialog>
        </div>
      </div>
    </QCardSection>
    <QCardSection
      class="row no-padding full-width justify-end bottom-actions"
    >
      <!--
        button can be in 4 states where user:
        - has not already joined, and has a suitable role to join
        - has not already joined, but does not have suitable role, so cannot join
        - has joined, but it's already started, so can't leave
        - has joined, and can leave
      -->
      <QBtn
        v-if="isUserParticipant"
        flat
        no-caps
        color="grey-9"
        class="action-button"
        :loading="isLeaving"
        :disable="!canLeave"
        @click="leave"
      >
        <QIcon
          v-bind="activityTypeIconProps"
          color="grey-9"
          size="xs"
          class="q-mr-sm"
        />
        <span class="block">
          {{ $t('ACTIVITYLIST.ITEM.LEAVE_CONFIRMATION_HEADER', { activityType: activityTypeTranslatedName }) }}
        </span>
      </QBtn>
      <QBtn
        v-else
        flat
        no-caps
        :color="canJoin ? activityTypeIconProps.color : 'grey-5'"
        class="action-button"
        :loading="isJoining"
        :disable="!canJoin"
        @click="join"
      >
        <QIcon
          v-bind="activityTypeIconProps"
          :color="canJoin ? activityTypeIconProps.color : 'grey-5'"
          size="xs"
          class="q-mr-sm"
        />
        <span class="block">
          {{ $t('ACTIVITYLIST.ITEM.JOIN_CONFIRMATION_HEADER', { activityType: activityTypeTranslatedName }) }}
        </span>
      </QBtn>
      <QBtn
        v-if="activity.isPublic"
        class="action-button"
        flat
        no-caps
        :to="{ name: 'publicActivity', params: { activityPublicId: activity.publicId } }"
      >
        <QIcon
          name="fas fa-globe"
          size="xs"
          class="q-mr-sm"
        />
        Public activity
      </QBtn>
      <QSpace />
      <QBtn
        v-if="isUserParticipant"
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
    preview: {
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
      getIsUserParticipant,
      getHasStarted,
      getIsFull,
    } = useActivityHelpers()

    const {
      getTranslatedName,
      getIconProps,
    } = useActivityTypeHelpers()

    const hasStarted = computed(() => getHasStarted(activity.value))
    const isUserParticipant = computed(() => getIsUserParticipant(activity.value))

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

      getIsUserParticipant,
      isUserParticipant,
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
      if (this.activity.isDisabled || this.isUserParticipant) {
        return false
      }
      return this.availableParticipantTypes.length > 0
    },
    canLeave () {
      return this.isUserParticipant && !this.hasStarted
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
      !this.preview && this.openActivity(this.activity)
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

  &.isUserParticipant
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
