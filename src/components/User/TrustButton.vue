<template>
  <q-btn
    round
    color="primary"
    class="karrot-button"
    @click="showModal = true"
    :disable="user.isCurrentUser && trustedBy.length === 0"
  >
    <q-chip
      floating
      :color="trusted || user.isCurrentUser ? 'positive' : 'negative'"
    >
      {{ trustedBy.length }}
    </q-chip>
    <q-modal
      v-model="showModal"
      minimized
    >
      <div class="generic-padding">
        <p>{{ headline }}</p>
        <div>
          <ProfilePicture
            v-for="u in trustedBy"
            :key="u.id"
            :user="u"
            :size="20"
          />
        </div>
        <div class="row justify-end actionButtons">
          <q-btn
            @click="showModal = false"
            rounded
            v-t="'BUTTON.CLOSE'"
          />
          <q-btn
            v-if="!trusted && !user.isCurrentUser"
            rounded
            color="secondary"
            @click="showCreateTrustDialog"
          >
            <span class="q-mr-xs">+</span>
            <img
              src="./twemoji-karrot.png"
              width="20px"
            >
          </q-btn>
        </div>
      </div>
    </q-modal>
  </q-btn>
</template>

<script>
import { mapGetters } from 'vuex'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'

import {
  QBtn,
  QModal,
  QChip,
  Dialog,
} from 'quasar'

export default {
  components: {
    ProfilePicture,
    QBtn,
    QModal,
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
  },
  data () {
    return {
      showModal: false,
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
    headline () {
      const otherTrust = this.trustedBy.filter(u => !u.isCurrentUser)
      const youTrust = this.trustedBy.find(u => u.isCurrentUser)
      return this.trustedBy.length > 0 ? this.$tc(
        youTrust ? (otherTrust.length > 0 ? 'USERDATA.PEOPLE_TRUST_USER' : 'USERDATA.YOU_TRUST_USER') : 'USERDATA.OTHER_PEOPLE_TRUST_USER',
        otherTrust.length,
        {
          count: otherTrust.length,
          groupName: this.group.name,
          userName: this.user.isCurrentUser ? this.$t('CONVERSATION.REACTIONS.YOU') : this.user.displayName,
          otherUser: otherTrust.length > 0 && otherTrust[0].displayName,
        },
      ) : this.$t(
        'USERDATA.FIRST_TRUST',
        {
          groupName: this.group.name,
          userName: this.user.displayName,
        },
      )
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
        .then(() => this.$emit('createTrust', { userId: this.user.id, groupId: this.group.id }))
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

.actionButtons .q-btn
  margin 20px 0 0 5px
</style>
