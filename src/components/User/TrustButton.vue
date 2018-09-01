<template>
  <q-btn
    round
    :size="small ? 'sm' : null"
    :color="isEditor ? 'primary' : 'white'"
    @click="showing = true"
    class="karrot-button"
    :class="!isEditor && 'small'"
    :title="tooltip"
  >
    <CircleProgress
      v-if="!isEditor"
      class="knob"
      :value="trustProgress"
    />
    <q-chip
      floating
      :style="small && 'top: 5px; right: -12px'"
      :color="trusted || user.isCurrentUser ? 'positive' : 'negative'"
    >
      {{ trustedBy.length }}
    </q-chip>
    <q-dialog
      v-model="showing"
      minimized
      :title="headline"
      :message="info"
    >
      <div slot="body">
        <ProfilePicture
          v-for="u in trustedBy"
          :key="u.id"
          :user="u"
          :size="35"
          class="q-mr-sm"
        />
      </div>
      <template
        slot="buttons"
        slot-scope="props"
      >
        <q-btn
          flat
          :label="$t('BUTTON.CLOSE')"
          @click="props.cancel"
        />
        <q-btn
          v-if="!trusted && !user.isCurrentUser"
          color="secondary"
          :loading="membership.trustUserStatus.pending"
          @click="showCreateTrustDialog"
        >
          <span class="q-mr-xs">+</span>
          <img
            src="./twemoji-karrot.png"
            width="20px"
          >
        </q-btn>
      </template>
    </q-dialog>
  </q-btn>
</template>

<script>
import { mapGetters } from 'vuex'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import CircleProgress from '@/components/General/CircleProgress'

import {
  QBtn,
  QChip,
  QDialog,
  Dialog,
} from 'quasar'

export default {
  components: {
    ProfilePicture,
    CircleProgress,
    QBtn,
    QDialog,
    QChip,
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
        if (!youTrust || this.user.isCurrentUser) return 'USERDATA.OTHER_PEOPLE_TRUST_USER'
        if (otherTrust.length === 0) return 'USERDATA.YOU_TRUST_USER'
        return 'USERDATA.PEOPLE_TRUST_USER'
      }

      const trustMessage = () => this.$tc(trustMessagePath(), otherTrust.length, {
        count: otherTrust.length,
        groupName: this.group.name,
        userName: this.user.isCurrentUser ? this.$t('CONVERSATION.REACTIONS.YOU') : this.user.displayName,
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
    },
    trustNeeded () {
      return this.threshold - this.trustedBy.length
    },
    tooltip () {
      if (this.isEditor) return this.headline
      return this.$t('USERDATA.NEWCOMER') + ' - ' + this.$t('USERDATA.TRUST_PROGRESS_TEXT', { trustNeeded: this.trustNeeded })
    },
  },
  methods: {
    showCreateTrustDialog () {
      Dialog.create({
        title: this.$t('USERDATA.DIALOGS.GIVE_TRUST.TITLE'),
        message: this.$t('USERDATA.DIALOGS.GIVE_TRUST.MESSAGE', { userName: this.user.displayName, groupName: this.group.name }),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.OF_COURSE'),
      })
        .then(() => this.$emit('createTrust', this.user.id))
        .catch(() => {})
    },
  },
}
</script>

<style lang="stylus" scoped>
.karrot-button >>> .q-btn-inner
  background-image url('./twemoji-karrot.png')
  background-size 60%
  background-repeat no-repeat
  background-position center
  min-height 100%
  min-width 100%
.karrot-button.small >>> .q-btn-inner
  background-size 50%

.knob
  position absolute
  top 0
  left 0
</style>
