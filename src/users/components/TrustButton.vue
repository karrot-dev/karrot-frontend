<template>
  <QBtn
    round
    :size="small ? 'sm' : null"
    :color="isEditor ? 'primary' : 'white'"
    class="karrot-button"
    :class="!isEditor && 'small'"
    :title="tooltip"
    @click="showing = true"
  >
    <CircleProgress
      v-if="!isEditor"
      class="circle-progress"
      :value="trustProgress"
    />
    <QBadge
      floating
      :style="small && 'top: 5px; right: -12px'"
      :color="trusted || user.isCurrentUser ? 'positive' : 'negative'"
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
            v-if="!trusted && !user.isCurrentUser"
            color="secondary"
            :loading="membership.trustUserStatus.pending"
            @click="showCreateTrustDialog"
          >
            <span class="q-mr-xs">+</span>
            <img
              :src="trustIcon"
              width="20px"
            >
          </QBtn>
          <QBtn
            v-if="trusted && !user.isCurrentUser"
            color="negative"
            :loading="membership.trustUserStatus.pending"
            @click="showRevokeTrustDialog"
          >
            <span class="q-mr-xs">-</span>
            <img
              :src="trustIcon"
              width="20px"
            >
          </QBtn>
        </QCardActions>
      </QCard>
    </QDialog>
  </QBtn>
</template>

<script>
import { mapGetters } from 'vuex'
import ProfilePicture from '@/users/components/ProfilePicture'
import CircleProgress from '@/utils/components/CircleProgress'
import TrustInfo from '@/users/components/TrustInfo'
import twemojiCarrot from './twemoji-carrot.png'

import {
  QBtn,
  QBadge,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  Dialog,
} from 'quasar'

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
    group: {
      default: () => ({}),
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
  data () {
    return {
      showing: false,
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'users/get',
    }),
    trustedBy () {
      return this.membership.trustedBy.map(this.getUser)
    },
    trusted () {
      return this.membership.trusted
    },
    threshold () {
      return this.membership.trustThresholdForNewcomer
    },
    trustProgress () {
      return this.membership.trustProgress
    },
    isEditor () {
      return this.membership.isEditor
    },
    headline () {
      const otherTrust = this.trustedBy.filter(u => !u.isCurrentUser)
      const youTrust = this.trustedBy.find(u => u.isCurrentUser)

      const firstTrustMessage = () => this.$t('USERDATA.FIRST_TRUST', {
        groupName: this.group.name,
        userName: this.user.displayName,
      })

      const trustMessagePath = () => {
        if (this.user.isCurrentUser) return 'USERDATA.OTHER_PEOPLE_TRUST_YOU'
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

      return (this.trustedBy.length > 0 || this.user.isCurrentUser) ? trustMessage() : firstTrustMessage()
    },
    info () {
      if (!this.isEditor && this.user.isCurrentUser) {
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
      }).onOk(() => this.$emit('create-trust', this.user.id))
    },
    showRevokeTrustDialog () {
      Dialog.create({
        title: this.$t('USERDATA.DIALOGS.REVOKE_TRUST.TITLE'),
        message: this.$t('USERDATA.DIALOGS.REVOKE_TRUST.MESSAGE', { userName: this.user.displayName, groupName: this.group.name }),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.YES'),
      }).onOk(() => this.$emit('revoke-trust', this.user.id))
    },
  },
}
</script>

<style lang="stylus" scoped>
.karrot-button >>> .q-btn__content
  min-width 100%
  min-height 100%
  background-image url('./twemoji-carrot.png')
  background-repeat no-repeat
  background-position center
  background-size 60%

.karrot-button.small >>> .q-btn-inner
  background-size 50%

.circle-progress
  position absolute
  top 0
  left 0
</style>
