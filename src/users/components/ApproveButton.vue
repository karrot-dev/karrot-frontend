<template>
  <QBtn
    round
    :color="hasRole ? 'secondary' : 'white'"
    :text-color="hasRole ? 'green' : 'grey-8'"
    :title="tooltip"
    icon="fas fa-leaf"
    @click="showing = true"
  >
    <QDialog
      v-model="showing"
    >
      <QCard>
        <QCardSection class="row no-wrap justify-between">
          <div class="text-h6">
            {{ trustedBy.length }} users approve {{ user.displayName }} in {{ group.name }}
          </div>
        </QCardSection>
        <QCardSection
          style="max-width: 700px"
        >
          Click the button below to approve!
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

import ProfilePicture from '@/users/components/ProfilePicture'

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
      isCurrentUser,
      hasRole,
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
    tooltip () {
      if (this.hasRole) return 'TODO'
      return 'TODO'
    },
  },
  methods: {
    showCreateTrustDialog () {
      Dialog.create({
        title: this.$t('USERDATA.DIALOGS.GIVE_TRUST.TITLE'),
        message: this.$t('USERDATA.DIALOGS.GIVE_TRUST.MESSAGE', { userName: this.user.displayName, groupName: this.group.name }),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.OF_COURSE'),
      }).onOk(() => this.trustUser({ groupId: this.groupId, userId: this.user.id, role: 'approved' }))
    },
    showRevokeTrustDialog () {
      Dialog.create({
        title: this.$t('USERDATA.DIALOGS.REVOKE_TRUST.TITLE'),
        message: this.$t('USERDATA.DIALOGS.REVOKE_TRUST.MESSAGE', { userName: this.user.displayName, groupName: this.group.name }),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.YES'),
      }).onOk(() => this.revokeTrust({ groupId: this.groupId, userId: this.user.id, role: 'approved' }))
    },
  },
}
</script>

<style lang="sass" scoped>
</style>
