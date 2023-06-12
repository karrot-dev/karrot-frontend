<template>
  <QBtn
    round
    :color="hasRole ? 'secondary' : 'white'"
    :text-color="hasRole ? 'white' : 'grey-8'"
    :title="canGiveTrust ? tooltip : $t('TRUST_FOR_ROLE.NEED_ROLE', { role: role.roleRequiredForTrust })"
    icon="fas fa-leaf"
    :disable="!canGiveTrust"
    @click="showing = true"
  >
    <QDialog
      v-model="showing"
    >
      <QCard>
        <QCardSection class="row no-wrap justify-between">
          <div class="text-h6">
            {{ headline }}
          </div>
        </QCardSection>
        <QCardSection
          style="max-width: 700px"
        >
          <p>{{ info }}</p>
          <p>{{ role.description }}</p>
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
            <QIcon name="fas fa-leaf" />
          </QBtn>
          <QBtn
            v-if="isTrusted && !isCurrentUser"
            color="negative"
            :loading="revokeTrustStatus.pending"
            @click="showRevokeTrustDialog"
          >
            <span class="q-mr-xs">-</span>
            <QIcon name="fas fa-leaf" />
          </QBtn>
        </QCardActions>
      </QCard>
    </QDialog>
  </QBtn>
</template>

<script>
import {
  QBtn,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QIcon,
  Dialog,
} from 'quasar'
import { toRefs, computed } from 'vue'

import { useAuthHelpers } from '@/authuser/helpers'
import { useAuthService } from '@/authuser/services'
import { useRevokeTrustMutation, useTrustUserMutation } from '@/group/mutations'
import { useCurrentGroupService } from '@/group/services'
import { useUserService } from '@/users/services'

import ProfilePicture from '@/users/components/ProfilePicture.vue'

export default {
  components: {
    ProfilePicture,
    QBtn,
    QDialog,
    QCard,
    QCardSection,
    QCardActions,
    QIcon,
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
  },
  setup (props) {
    const {
      user,
      membership,
    } = toRefs(props)

    const {
      group,
      groupId,
      roles: authUserRoles,
    } = useCurrentGroupService()

    const {
      getUserById,
    } = useUserService()

    const {
      getIsCurrentUser,
    } = useAuthHelpers()

    const {
      userId: authUserId,
    } = useAuthService()

    const isCurrentUser = computed(() => getIsCurrentUser(user.value))
    const hasRole = computed(() => membership.value.roles.includes('approved'))
    const isTrusted = computed(() => membership.value.trust.some(trust => trust.givenBy === authUserId.value && trust.role === 'approved'))
    const role = computed(() => group.value.roles.approved)

    const {
      mutate: trustUser,
      status: trustUserStatus,
    } = useTrustUserMutation()

    const {
      mutate: revokeTrust,
      status: revokeTrustStatus,
    } = useRevokeTrustMutation()

    return {
      authUserRoles,
      group,
      groupId,
      isTrusted,
      isCurrentUser,
      hasRole,
      role,
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
      return this.membership.trust.filter(trust => trust.role === 'approved').map(trust => this.getUserById(trust.givenBy))
    },
    canGiveTrust () {
      return Boolean(!this.role.roleRequiredForTrust || this.authUserRoles.includes(this.role.roleRequiredForTrust))
    },
    headline () {
      const otherTrust = this.trustedBy.filter(u => !this.getIsCurrentUser(u))
      const youTrust = this.trustedBy.find(u => this.getIsCurrentUser(u))

      const firstTrustMessage = () => this.$t('TRUST_FOR_ROLE.FIRST_TRUST', {
        groupName: this.group.name,
        userName: this.user.displayName,
        role: this.role.displayName || this.role.name,
      })

      const trustMessagePath = () => {
        if (this.isCurrentUser) return 'TRUST_FOR_ROLE.OTHER_PEOPLE_TRUST_YOU'
        if (!youTrust) return 'TRUST_FOR_ROLE.OTHER_PEOPLE_TRUST_USER'
        if (otherTrust.length === 0) return 'TRUST_FOR_ROLE.YOU_TRUST_USER'
        return 'TRUST_FOR_ROLE.PEOPLE_TRUST_USER'
      }

      const trustMessage = () => this.$tc(trustMessagePath(), otherTrust.length, {
        count: otherTrust.length,
        groupName: this.group.name,
        userName: this.user.displayName,
        otherUser: otherTrust.length > 0 && otherTrust[0].displayName,
        role: this.role.displayName || this.role.name,
      })

      return (this.trustedBy.length > 0 || this.isCurrentUser) ? trustMessage() : firstTrustMessage()
    },
    info () {
      if (!this.hasRole && this.isCurrentUser) {
        return this.$t('TRUST_FOR_ROLE.NO_ROLE_INFO', {
          groupName: this.group.name,
          threshold: this.threshold,
          role: this.role.displayName || this.role.name,
        })
      }
      if (!this.hasRole) {
        return this.$t('TRUST_FOR_ROLE.TRUST_PROGRESS', {
          userName: this.user.displayName,
          trustNeeded: this.trustNeeded,
          role: this.role.displayName || this.role.name,
        })
      }
      return ''
    },
    trustNeeded () {
      return this.role.threshold - this.trustedBy.length
    },
    tooltip () {
      if (this.hasRole) return this.headline
      return this.$t('TRUST_FOR_ROLE.TRUST_PROGRESS', {
        trustNeeded: this.trustNeeded,
        role: this.role.displayName || this.role.name,
        userName: this.user.displayName,
      })
    },
  },
  methods: {
    showCreateTrustDialog () {
      Dialog.create({
        title: this.$t('TRUST_FOR_ROLE.GIVE_DIALOG.TITLE', {
          role: this.role.displayName || this.role.name,
        }),
        message: this.$t('TRUST_FOR_ROLE.GIVE_DIALOG.MESSAGE', {
          userName: this.user.displayName,
          groupName: this.group.name,
          role: this.role.displayName || this.role.name,
        }),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.OF_COURSE'),
      }).onOk(() => this.trustUser({ groupId: this.groupId, userId: this.user.id, role: 'approved' }))
    },
    showRevokeTrustDialog () {
      Dialog.create({
        title: this.$t('TRUST_FOR_ROLE.REVOKE_DIALOG.TITLE', {
          role: this.role.displayName || this.role.name,
        }),
        message: this.$t('TRUST_FOR_ROLE.REVOKE_DIALOG.MESSAGE', {
          userName: this.user.displayName,
          groupName: this.group.name,
          role: this.role.displayName || this.role.name,
        }),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.YES'),
      }).onOk(() => this.revokeTrust({ groupId: this.groupId, userId: this.user.id, role: 'approved' }))
    },
  },
}
</script>
