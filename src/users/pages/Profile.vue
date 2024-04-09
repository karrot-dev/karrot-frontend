<template>
  <div v-if="user && user.id">
    <div class="k-profile">
      <QBanner
        v-if="!currentGroupMembership && currentGroup"
        class="bg-warning text-white shadow-2 q-mb-sm q-pa-none"
        style="min-height: unset"
      >
        <template #avatar>
          <div
            class="q-pa-sm"
            style="background-color: rgba(0, 0, 0, .1)"
          >
            <QIcon
              name="priority_high"
              class="text-white"
              style="font-size: 24px"
            />
          </div>
        </template>
        {{ $t('SWITCHGROUP.NOT_MEMBER', { userName: user.displayName, groupName: currentGroup.name }) }}
      </QBanner>
      <div
        class="row justify-end"
        style="margin-bottom: -32px"
      >
        <SwitchGroupButton
          :user="user"
          :groups="groups"
        />
      </div>
      <div class="photoAndName row no-wrap">
        <div
          class="photo q-ma-md"
        >
          <ProfilePicture
            :is-link="false"
            :user="user"
            :size="profilePictureSize"
            :editable="isCurrentUser"
          />
        </div>
        <div
          style="overflow: hidden"
          class="self-center"
        >
          <h1 class="ellipsis">
            {{ user.displayName }}
          </h1>
        </div>
      </div>
      <QCard
        v-if="!isInfoOnly"
        class="profile-info relative-position q-pt-sm"
      >
        <div
          class="user-actions z-fab"
        >
          <QBtn
            v-if="isCurrentUser"
            icon="fas fa-pencil-alt"
            small
            round
            color="secondary"
            :to="{ name: 'settings' }"
          />
          <MeetButton
            v-if="!isCurrentUser"
            small
            round
            color="secondary"
            :subject="`user:${[user.id, currentUserId].sort((a, b) => a - b).join(',')}`"
          />
          <QBtn
            v-if="!isCurrentUser"
            small
            round
            color="secondary"
            icon="fas fa-comments"
            :title="$t('USERDATA.PRIVATE_MESSAGE', {userName: user.displayName})"
            @click="openUserChat(user)"
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
            :membership="currentGroupMembership"
          />
          <ApproveButton
            v-if="currentGroupMembership && currentGroup.roles.approved"
            :user="user"
            :membership="currentGroupMembership"
          />
        </div>
        <QList>
          <QItem>
            <QItemSection side>
              <QIcon name="alternate_email" />
            </QItemSection>
            <QItemSection class="ellipsis">
              {{ user.username }}
            </QItemSection>
          </QItem>

          <QItem>
            <QItemSection side>
              <QIcon name="fas fa-fw fa-envelope" />
            </QItemSection>
            <QItemSection class="ellipsis">
              <a :href="mailto(user.email)">{{ user.email }}</a>
            </QItemSection>
          </QItem>

          <QItem v-if="user.mobileNumber">
            <QItemSection side>
              <QIcon name="fas fa-fw fa-phone" />
            </QItemSection>
            <QItemSection>
              {{ user.mobileNumber }}
            </QItemSection>
          </QItem>

          <QItem v-if="user.address">
            <QItemSection side>
              <QIcon name="fas fa-fw fa-map-marker" />
            </QItemSection>
            <QItemSection>
              {{ user.address }}
            </QItemSection>
          </QItem>
        </QList>
        <QCardSection v-if="$q.platform.is.mobile && user.latitude && user.longitude">
          <UserMapPreview
            :user="user"
            style="height: 100px"
          />
        </QCardSection>
        <QCardSection>
          <Markdown
            v-if="user.description"
            :source="user.description"
          />
        </QCardSection>
      </QCard>

      <QDialog
        v-model="showConflictSetup"
      >
        <div
          v-if="!canStartConflictResolution"
          class="generic-padding bg-white"
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
              href="https://community.karrot.world/t/how-does-the-conflict-resolution-feature-work/254"
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
          class="bg-white"
          @start-conflict-resolution="startConflictResolution"
          @close="toggleConflictSetup"
        />
      </QDialog>
    </div>
    <KSpinner v-show="isLoadingHistory" />
    <QCard v-if="history.length > 0">
      <QCardSection>
        {{ $t('GROUP.HISTORY') }}
      </QCardSection>
      <QCardSection>
        <HistoryList
          class="padding-top"
          :history="history"
          :pending="isLoadingHistory"
          :can-fetch-past="historyHasNextPage"
          :fetch-past="() => historyFetchNextPage()"
        />
      </QCardSection>
    </QCard>
  </div>
</template>

<script>
import {
  QCard,
  QCardSection,
  QBanner,
  QBtn,
  QList,
  QItem,
  QItemSection,
  QDialog,
  QIcon,
} from 'quasar'
import { defineAsyncComponent, computed } from 'vue'

import { useAuthHelpers } from '@/authuser/helpers'
import { useAuthService } from '@/authuser/services'
import { useCurrentGroupService } from '@/group/services'
import { useGroupInfoService } from '@/groupInfo/services'
import { useHistoryListQuery } from '@/history/queries'
import { useCreateIssueMutation } from '@/issues/mutations'
import { useIssueListQuery } from '@/issues/queries'
import { useDetailService } from '@/messages/services'
import { useActiveUserService } from '@/users/services'

import HistoryList from '@/history/components/HistoryList.vue'
import UserMapPreview from '@/maps/components/UserMapPreview.vue'
import MeetButton from '@/meet/components/MeetButton.vue'
import ApproveButton from '@/users/components/ApproveButton.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'
import SwitchGroupButton from '@/users/components/SwitchGroupButton.vue'
import TrustButton from '@/users/components/TrustButton.vue'
import KSpinner from '@/utils/components/KSpinner.vue'
import Markdown from '@/utils/components/Markdown.vue'

const ConflictSetup = defineAsyncComponent(() => import('@/issues/components/ConflictSetup.vue'))

export default {
  components: {
    MeetButton,
    HistoryList,
    KSpinner,
    Markdown,
    UserMapPreview,
    ProfilePicture,
    TrustButton,
    ApproveButton,
    SwitchGroupButton,
    ConflictSetup,
    QCard,
    QCardSection,
    QBanner,
    QBtn,
    QList,
    QItem,
    QItemSection,
    QDialog,
    QIcon,
  },
  setup () {
    const {
      groupId,
      group,
      getMembership,
      isEditor,
      authUserRoles,
    } = useCurrentGroupService()
    const { getGroupById } = useGroupInfoService()

    const { openUserChat } = useDetailService()
    const { getIsCurrentUser } = useAuthHelpers()

    const {
      userId,
      user,
    } = useActiveUserService()

    const { userId: currentUserId } = useAuthService()
    const isCurrentUser = computed(() => getIsCurrentUser(user.value))
    const currentGroupMembership = computed(() => getMembership(userId.value))

    const groups = computed(() => user.value?.groups
      .map(getGroupById)
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name)))

    const {
      history,
      isLoading: isLoadingHistory,
      hasNextPage: historyHasNextPage,
      fetchNextPage: historyFetchNextPage,
    } = useHistoryListQuery({
      groupId,
      userId,
    })

    const {
      issues: ongoingIssues,
    } = useIssueListQuery({ groupId, status: 'ongoing' })

    const {
      mutate: startConflictResolution,
      status: issueCreateStatus,
    } = useCreateIssueMutation()

    return {
      currentUserId,
      authUserRoles,
      ongoingIssues,
      isCurrentUser,
      currentGroup: group,
      user,
      groups,
      history,
      isLoadingHistory,
      historyHasNextPage,
      historyFetchNextPage,
      currentGroupMembership,
      isEditor,
      openUserChat,
      startConflictResolution,
      issueCreateStatus,
    }
  },
  data () {
    return {
      showConflictSetup: false,
    }
  },
  computed: {
    ongoingConflict () {
      return this.ongoingIssues.find(i => i.affectedUser === this.user.id)
    },
    isConflictOngoing () {
      return Boolean(this.ongoingConflict)
    },
    profilePictureSize () {
      return this.$q.platform.is.mobile ? 80 : 180
    },
    isInfoOnly () {
      return !this.user.email
    },
    conflictResolutionPossible () {
      // is it possible at all to start a conflict resolution process?
      return this.currentGroupMembership && !this.isCurrentUser
    },
    canStartConflictResolution () {
      return this.conflictResolutionPossible && this.solvableConflictSetupRequirements.length === 0
    },
    solvableConflictSetupRequirements () {
      if (!this.currentGroup) {
        return []
      }
      if (this.currentGroup && this.currentGroup.membership && !this.isEditor) {
        return [this.$t('CONFLICT.REQUIREMENTS.NEWCOMER')]
      }
      return []
    },
    canApprove () {
      const role = this.currentGroup.roles.approved
      if (!role) return false
      return (
        // Either no requirement...
        !role.roleRequiredForTrust ||
        // ... or auth user meets the requirement
        this.authUserRoles.includes(role.roleRequiredForTrust)
      )
    },
  },
  methods: {
    mailto (email) {
      return `mailto:${email}`
    },
    toggleConflictSetup () {
      this.showConflictSetup = !this.showConflictSetup
    },
  },
}
</script>

<style scoped lang="sass">
::v-deep(.q-banner__avatar)
  align-self: center

body.desktop .k-profile
  .photoAndName
    margin-bottom: 20px
    margin-left: 26px

  .name
    padding-left: 18px

.k-profile
  .photoAndName
    margin-top: 22px
    margin-bottom: 14px
    margin-left: 10px

  .name
    padding-left: 6px

  .photo
    transform: rotate(-3deg)

  .user-actions
    position: absolute
    top: -24px
    right: 10px

</style>
