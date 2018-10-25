<template>
  <q-item
    link
    :class="{ isNonPending: !application.isPending }"
    @click.native="openChatIfCannotDecide"
  >
    <q-item-side>
      <ProfilePicture
        :user="application.user"
        :size="30"
        :is-link="false"
      />
    </q-item-side>
    <q-item-main>
      <q-item-tile
        label
      >
        {{ userName }}
      </q-item-tile>
      <q-item-tile
        sublabel
      >
        {{ submittedOn }}
      </q-item-tile>
      <q-item-tile
        v-if="application.status !== 'pending'"
        sublabel
      >
        <i18n
          :path="decision"
        >
          <DateAsWords
            place="relativeDate"
            style="display: inline"
            :date="application.decidedAt"
          />
        </i18n>
        <template v-if="application.status !== 'withdrawn'">
          <br>
          <i18n
            :path="personDeciding"
          >
            <router-link
              place="userName"
              @click.native.stop=""
              :to="{name: 'user', params: { userId: application.decidedBy.id }}"
            >
              {{ application.decidedBy.displayName }}
            </router-link>
          </i18n>
        </template>
      </q-item-tile>
    </q-item-main>
    <q-popover
      v-if="application.canDecide"
      touch-position
    >
      <q-list
        v-close-overlay
        link
      >
        <q-item
          @click.native="openChat"
        >
          <q-item-side
            icon="fas fa-fw fa-comments"
          />
          <q-item-main :label="$t('BUTTON.OPEN')" />
        </q-item>
        <q-item
          @click.native="pressAccept"
        >
          <q-item-side
            icon="fas fa-fw fa-check"
          />
          <q-item-main :label="$t('BUTTON.ACCEPT')" />
        </q-item>
        <q-item
          @click.native="decline"
        >
          <q-item-side
            icon="fas fa-fw fa-times"
          />
          <q-item-main :label="$t('BUTTON.DECLINE')" />
        </q-item>
      </q-list>
    </q-popover>
  </q-item>
</template>

<script>
import {
  Dialog,
  QItem,
  QItemMain,
  QItemSide,
  QItemTile,
  QPopover,
  QList,
} from 'quasar'
import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'

export default {
  components: {
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    QPopover,
    QList,
    ProfilePicture,
    DateAsWords,
  },
  props: {
    application: {
      required: true,
      type: Object,
    },
  },
  methods: {
    openChat () {
      this.$emit('openChat', this.application)
    },
    openChatIfCannotDecide () {
      if (this.application.canDecide) return
      this.openChat()
    },
    pressAccept () {
      Dialog.create({
        title: this.$t('APPLICATION.ACCEPT_CONFIRMATION_HEADER'),
        message: this.$t('APPLICATION.ACCEPT_CONFIRMATION_TEXT', { userName: this.userName }),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$emit('accept', this.application.id))
        .catch(() => {})
    },
    decline () {
      Dialog.create({
        title: this.$t('APPLICATION.DECLINE_CONFIRMATION_HEADER'),
        message: this.$t('APPLICATION.DECLINE_CONFIRMATION_TEXT', { userName: this.userName }),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$emit('decline', this.application.id))
        .catch(() => {})
    },
  },
  computed: {
    userName () {
      return this.application.user.displayName
    },
    submittedOn () {
      const date = this.$d(this.application.createdAt, 'long')
      return this.$t('APPLICATION.SUBMITTED_ON', { date: date })
    },
    decision () {
      switch (this.application.status) {
        case 'accepted':
          return 'GROUP.JOINED'
        case 'declined':
          return 'GROUP.DECLINED'
        case 'withdrawn':
          return 'APPLICATION.WITHDRAWN'
      }
    },
    personDeciding () {
      switch (this.application.status) {
        case 'accepted':
          return 'GROUP.ADDED_BY'
        case 'declined':
          return 'GROUP.DECLINED_BY'
      }
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.isNonPending
  opacity 0.8
</style>
