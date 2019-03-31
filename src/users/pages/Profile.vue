<template>
  <div v-if="user && user.id">
    <div class="k-profile">
      <QAlert
        v-if="!currentGroupMembership && currentGroup"
        type="warning"
      >
        {{ $t('SWITCHGROUP.NOT_MEMBER', { userName: user.displayName, groupName: currentGroup.name }) }}
      </QAlert>
      <div
        class="row justify-end"
        style="margin-bottom: -32px"
      >
        <SwitchGroupButton
          :user="user"
          :groups="user.groups"
          @selectGroup="selectGroup"
        />
      </div>
      <div class="photoAndName row no-wrap ellipsis">
        <Transition
          duration="510"
          name="turn-in"
          appear
        >
          <div class="photo q-pa-sm q-ma-md bg-white shadow-4">
            <ProfilePicture
              :is-link="false"
              :user="user"
              :size="profilePictureSize"
            />
          </div>
        </Transition>
        <div
          style="overflow: hidden"
          class="self-center"
        >
          <h1 class="name accent-font">
            {{ user.displayName }}
          </h1>
        </div>
      </div>
      <QCard
        v-if="!isInfoOnly"
        class="profile-info relative-position q-pt-sm"
      >
        <div
          class="user-actions"
        >
          <QBtn
            v-if="user.isCurrentUser"
            icon="fas fa-pencil-alt"
            small
            round
            color="secondary"
            :to="{ name: 'settings' }"
          />
          <QBtn
            v-if="!user.isCurrentUser"
            small
            round
            color="secondary"
            icon="fas fa-comments"
            :title="$t('USERDATA.PRIVATE_MESSAGE', {userName: user.displayName})"
            @click="detail(user)"
          />
          <QBtn
            v-if="isConflictOngoing"
            :to="{ name: 'issueDetail', params: { groupId: currentGroup.id, issueId: ongoingConflict.id } }"
            icon="fas fa-frown-open"
            small
            round
            color="negative"
            :title="$t('CONFLICT.WITH', {userName: user.displayName})"
          />
          <QBtn
            v-else-if="conflictResolutionPossible"
            icon="fas fa-frown-open"
            small
            round
            :color="canStartConflictResolution ? 'grey-8' : 'grey-5'"
            :title="$t('CONFLICT.SETUP_HEADER', {user: user.displayName})"
            @click="toggleConflictSetup()"
          />
          <TrustButton
            v-if="currentGroupMembership"
            :user="user"
            :group="currentGroup"
            :membership="currentGroupMembership"
            @createTrust="createTrust"
          />
        </div>
        <QList>
          <QItem>
            <QItemSide icon="fas fa-fw fa-envelope" />
            <QItemMain class="ellipsis">
              <a :href="mailto(user.email)">{{ user.email }}</a>
            </QItemMain>
          </QItem>

          <QItem v-if="user.mobileNumber">
            <QItemSide icon="fas fa-fw fa-phone" />
            <QItemMain>
              {{ user.mobileNumber }}
            </QItemMain>
          </QItem>

          <QItem v-if="user.address">
            <QItemSide icon="fas fa-fw fa-map-marker-alt" />
            <QItemMain>
              {{ user.address }}
            </QItemMain>
          </QItem>
        </QList>
        <QCardMedia v-if="$q.platform.is.mobile && user.latitude && user.longitude">
          <UserMapPreview
            :user="user"
            style="height: 100px"
          />
        </QCardMedia>
        <QCardMain>
          <Markdown
            v-if="user.description"
            :source="user.description"
          />
        </QCardMain>
      </QCard>

      <QModal
        v-model="showConflictSetup"
      >
        <template v-if="showConflictSetup">
          <div
            v-if="!canStartConflictResolution"
            class="generic-padding"
            style="max-width: 700px"
          >
            <h3 v-t="{ path: 'CONFLICT.SETUP_HEADER', args: { user: user.displayName } }" />
            <p
              v-for="(message, idx) in solvableConflictSetupRequirements"
              :key="idx"
            >
              {{ message }}
            </p>
            <p>
              <a
                v-t="'CONFLICT.FIND_OUT_MORE'"
                href="https://community.foodsaving.world/t/how-does-the-conflict-resolution-feature-work/254"
                target="_blank"
                rel="noopener"
                style="text-decoration: underline"
              />
            </p>
          </div>
          <ConflictSetup
            v-else
            :current-group="currentGroup"
            :user="user"
            :status="issueCreateStatus"
            @startConflictResolution="startConflictResolution"
            @close="toggleConflictSetup"
          />
        </template>
      </QModal>
    </div>
    <KSpinner v-show="historyStatus.pending" />
    <QCard v-if="history.length > 0">
      <QCardTitle>
        {{ $t('GROUP.HISTORY') }}
      </QCardTitle>
      <QCardMain>
        <HistoryContainer :history="history" />
      </QCardMain>
    </QCard>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import HistoryContainer from '@/history/pages/HistoryContainer'
import KSpinner from '@/utils/components/KSpinner'
import Markdown from '@/utils/components/Markdown'
import ProfilePicture from '@/users/components/ProfilePicture'
import UserMapPreview from '@/maps/components/UserMapPreview'
import TrustButton from '@/users/components/TrustButton'
import SwitchGroupButton from '@/users/components/SwitchGroupButton'

const ConflictSetup = () => import('@/issues/components/ConflictSetup')

import {
  QCard,
  QCardTitle,
  QCardMain,
  QAlert,
  QCardMedia,
  QBtn,
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QModal,
} from 'quasar'

export default {
  components: {
    HistoryContainer,
    KSpinner,
    Markdown,
    UserMapPreview,
    ProfilePicture,
    TrustButton,
    SwitchGroupButton,
    ConflictSetup,
    QCard,
    QCardTitle,
    QCardMain,
    QAlert,
    QCardMedia,
    QBtn,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QModal,
  },
  data () {
    return {
      showConflictSetup: false,
    }
  },
  computed: {
    ...mapGetters({
      user: 'users/activeUser',
      currentGroup: 'currentGroup/value',
      history: 'history/byCurrentGroupAndUser',
      historyStatus: 'history/fetchStatus',
      ongoingIssues: 'issues/ongoing',
      issueCreateStatus: 'issues/createStatus',
    }),
    ongoingConflict () {
      return this.ongoingIssues.find(i => i.affectedUser.id === this.user.id)
    },
    isConflictOngoing () {
      return Boolean(this.ongoingConflict)
    },
    profilePictureSize () {
      return this.$q.platform.is.mobile ? 80 : 180
    },
    currentGroupMembership () {
      return this.user.membership
    },
    isInfoOnly () {
      return !this.user.email
    },
    conflictResolutionPossible () {
      // is it possible at all to start a conflict resolution process?
      return this.currentGroupMembership && !this.user.isCurrentUser
    },
    canStartConflictResolution () {
      return this.conflictResolutionPossible && this.solvableConflictSetupRequirements.length === 0
    },
    solvableConflictSetupRequirements () {
      const { activeEditorsCount, activeEditorsRequiredForConflictResolution: requiredCount } = this.currentGroup
      if (activeEditorsCount < requiredCount) {
        return [this.$t('CONFLICT.REQUIREMENTS.ACTIVE_EDITORS', { activeEditorsCount, requiredCount })]
      }
      if (this.currentGroup && this.currentGroup.membership && !this.currentGroup.membership.isEditor) {
        return [this.$t('CONFLICT.REQUIREMENTS.NEWCOMER')]
      }
      return []
    },
  },
  watch: {
    showConflictSetup (val) {
      if (val) return
      this.clearIssueMeta(['create'])
    },
  },
  methods: {
    ...mapActions({
      detail: 'detail/openForUser',
      createTrust: 'currentGroup/trustUser',
      selectGroup: 'currentGroup/select',
      startConflictResolution: 'issues/create',
      clearIssueMeta: 'issues/meta/clear',
    }),
    mailto (email) {
      return `mailto:${email}`
    },
    toggleConflictSetup () {
      this.showConflictSetup = !this.showConflictSetup
    },
  },
}
</script>

<style scoped lang="stylus">
body.desktop .k-profile
  .photoAndName
    margin-left 26px
    margin-bottom 20px
  .name
    padding-left 18px

.k-profile
  .photoAndName
    margin-left 10px
    margin-top 22px
    margin-bottom 14px
  .name
    padding-left 6px
  .photo
    transform rotate(-3deg)
  .user-actions
    position absolute
    top -24px
    right 10px

.turn-in-enter
  transform rotate(-15deg)

.turn-in-leave-active, .turn-in-enter-active
  transition: all .5s ease

.turn-in-enter-to
  transform rotate(-3deg)
</style>
