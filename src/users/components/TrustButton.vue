<template>
  <QBtn
    round
    :size="small ? 'sm' : null"
    :color="isEditor ? 'primary' : 'white'"
    class="karrot-button"
    :class="!isEditor && 'small'"
    :title="tooltip"
    @click.stop.prevent="showing = true"
  >
    <CircleProgress
      v-if="!isEditor"
      class="circle-progress"
      :value="trustProgress"
    />
    <QBadge
      floating
      :style="small && 'top: 5px; right: -12px'"
      :color="isTrusted || isCurrentUser ? 'positive' : 'negative'"
    >
      {{ trustedBy.length }}
    </QBadge>
    <QDialog
      v-model="showing"
    >
      <QCard>
        <QCardSection class="row no-wrap justify-between">
          <div class="text-h6">
            {{ headline }}
          </div>
          <TrustInfo />
        </QCardSection>
        <QCardSection
          style="max-width: 700px"
        >
          {{ info }}
        </QCardSection>
        <QCardSection>
          <ProfilePicture
            v-for="u in trustedBy"
            :key="u.id"
            :user="u"
            :size="35"
            class="q-mr-sm"
          />
        </QCardSection>
        <QCardActions align="right">
          <QBtn
            v-close-popup
            flat
            :label="$t('BUTTON.CLOSE')"
          />
          <QBtn
            v-if="!isTrusted && !isCurrentUser"
            color="secondary"
            :loading="trustUserStatus.pending"
            @click="showCreateTrustDialog"
          >
            <span class="q-mr-xs">+</span>
            <img
              :src="trustIcon"
              class="trust-icon"
            >
          </QBtn>
          <QBtn
            v-if="isTrusted && !isCurrentUser"
            color="negative"
            :loading="revokeTrustStatus.pending"
            @click="showRevokeTrustDialog"
          >
            <span class="q-mr-xs">-</span>
            <img
              :src="trustIcon"
              class="trust-icon"
            >
          </QBtn>
        </QCardActions>
      </QCard>
    </QDialog>
  </QBtn>
</template>

<script>
import {
  QBtn,
  QBadge,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  Dialog,
} from 'quasar'
import { toRefs, computed } from 'vue'

import { useAuthHelpers } from '@/authuser/helpers'
import { useMembershipHelpers } from '@/group/helpers'
import { useRevokeTrustMutation, useTrustUserMutation } from '@/group/mutations'
import { useCurrentGroupService } from '@/group/services'
import { useUserService } from '@/users/services'

import ProfilePicture from '@/users/components/ProfilePicture.vue'
import TrustInfo from '@/users/components/TrustInfo.vue'
import CircleProgress from '@/utils/components/CircleProgress.vue'

import twemojiCarrot from './twemoji-carrot.png'

export default {
  components: {
    ProfilePicture,
    CircleProgress,
    TrustInfo,
    QBtn,
    QBadge,
    QDialog,
    QCard,
    QCardSection,
    QCardActions,
  },
  props: {
    user: {
      default: null,
      type: Object,
    },
    membership: {
      default: () => ({}),
      type: Object,
    },
    small: {
      default: false,
      type: Boolean,
    },
  },
  setup (props) {
    const {
      user,
      membership,
    } = toRefs(props)

    const {
      group,
      groupId,
    } = useCurrentGroupService()

    const {
      getUserById,
    } = useUserService()

    const {
      getIsCurrentUser,
    } = useAuthHelpers()

    const {
      getIsEditor,
      getIsTrusted,
      getTrustProgress,
    } = useMembershipHelpers()

    const isCurrentUser = computed(() => getIsCurrentUser(user.value))
    const isEditor = computed(() => getIsEditor(membership.value))
    const isTrusted = computed(() => getIsTrusted(membership.value))
    const trustProgress = computed(() => getTrustProgress(membership.value))

    const {
      mutate: trustUser,
      status: trustUserStatus,
    } = useTrustUserMutation()

    const {
      mutate: revokeTrust,
      status: revokeTrustStatus,
    } = useRevokeTrustMutation()

    return {
      group,
      groupId,
      isTrusted,
      trustProgress,
      isCurrentUser,
      isEditor,
      getUserById,
      getIsCurrentUser,

      trustUser,
      trustUserStatus,

      revokeTrust,
      revokeTrustStatus,
    }
  },
  data () {
    return {
      showing: false,
    }
  },
  computed: {
    trustedBy () {
      return this.membership.trustedBy.map(this.getUserById)
    },
    threshold () {
      return this.group.trustThresholdForNewcomer
    },
    headline () {
      const otherTrust = this.trustedBy.filter(u => !this.getIsCurrentUser(u))
      const youTrust = this.trustedBy.find(u => this.getIsCurrentUser(u))

      const firstTrustMessage = () => this.$t('USERDATA.FIRST_TRUST', {
        groupName: this.group.name,
        userName: this.user.displayName,
      })

      const trustMessagePath = () => {
        if (this.isCurrentUser) return 'USERDATA.OTHER_PEOPLE_TRUST_YOU'
        if (!youTrust) return 'USERDATA.OTHER_PEOPLE_TRUST_USER'
        if (otherTrust.length === 0) return 'USERDATA.YOU_TRUST_USER'
        return 'USERDATA.PEOPLE_TRUST_USER'
      }

      const trustMessage = () => this.$tc(trustMessagePath(), otherTrust.length, {
        count: otherTrust.length,
        groupName: this.group.name,
        userName: this.user.displayName,
        otherUser: otherTrust.length > 0 && otherTrust[0].displayName,
      })

      return (this.trustedBy.length > 0 || this.isCurrentUser) ? trustMessage() : firstTrustMessage()
    },
    info () {
      if (!this.isEditor && this.isCurrentUser) {
        return this.$t('USERDATA.NEWCOMER_INFO', {
          groupName: this.group.name,
          threshold: this.threshold,
        })
      }
      if (!this.isEditor) {
        return this.$t('USERDATA.TRUST_PROGRESS_TEXT_LONG', {
          userName: this.user.displayName,
          trustNeeded: this.trustNeeded,
        })
      }
      return ''
    },
    trustNeeded () {
      return this.threshold - this.trustedBy.length
    },
    tooltip () {
      if (this.isEditor) return this.headline
      return this.$t('USERDATA.NEWCOMER') + ' - ' + this.$t('USERDATA.TRUST_PROGRESS_TEXT', { trustNeeded: this.trustNeeded })
    },
  },
  created () {
    this.trustIcon = twemojiCarrot
  },
  methods: {
    showCreateTrustDialog () {
      Dialog.create({
        title: this.$t('USERDATA.DIALOGS.GIVE_TRUST.TITLE'),
        message: this.$t('USERDATA.DIALOGS.GIVE_TRUST.MESSAGE', { userName: this.user.displayName, groupName: this.group.name }),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.OF_COURSE'),
      }).onOk(() => this.trustUser({ groupId: this.groupId, userId: this.user.id }))
    },
    showRevokeTrustDialog () {
      Dialog.create({
        title: this.$t('USERDATA.DIALOGS.REVOKE_TRUST.TITLE'),
        message: this.$t('USERDATA.DIALOGS.REVOKE_TRUST.MESSAGE', { userName: this.user.displayName, groupName: this.group.name }),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.YES'),
      }).onOk(() => this.revokeTrust({ groupId: this.groupId, userId: this.user.id }))
    },
  },
}
</script>

<style lang="sass" scoped>
.karrot-button ::v-deep(.q-btn__content)
  min-width: 100%
  min-height: 100%
  background-image: url('./twemoji-carrot.png')
  background-repeat: no-repeat
  background-position: center
  background-size: 60%

.karrot-button.small ::v-deep(.q-btn-inner)
  background-size: 50%

.circle-progress
  position: absolute
  top: 0
  left: 0

.trust-icon
  width: 20px
</style>
