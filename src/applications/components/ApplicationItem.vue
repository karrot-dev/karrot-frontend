<template>
  <QItem
    link
    :class="{ isNonPending: !application.isPending }"
    @click.native="openChatIfCannotDecide"
  >
    <QItemSection side>
      <ProfilePicture
        :user="application.user"
        :size="30"
        :is-link="false"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel>
        {{ userName }}
      </QItemLabel>
      <QItemLabel caption>
        {{ submittedOn }}
      </QItemLabel>
      <QItemLabel caption
        v-if="application.status !== 'pending'"
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
            <RouterLink
              place="userName"
              :to="{name: 'user', params: { userId: application.decidedBy.id }}"
              @click.native.stop
            >
              {{ application.decidedBy.displayName }}
            </RouterLink>
          </i18n>
        </template>
      </QItemLabel>
    </QItemSection>
    <QPopover
      v-if="application.canDecide"
      touch-position
    >
      <QList
        v-close-popup
        link
      >
        <QItem
          @click.native="openChat"
        >
          <QItemSection side
            icon="fas fa-fw fa-comments"
          />
          <QItemSection :label="$t('BUTTON.OPEN')" />
        </QItem>
        <QItem
          @click.native="pressAccept"
        >
          <QItemSection side
            icon="fas fa-fw fa-check"
          />
          <QItemSection :label="$t('BUTTON.ACCEPT')" />
        </QItem>
        <QItem
          @click.native="decline"
        >
          <QItemSection side
            icon="fas fa-fw fa-times"
          />
          <QItemSection :label="$t('BUTTON.DECLINE')" />
        </QItem>
      </QList>
    </QPopover>
  </QItem>
</template>

<script>
import {
  Dialog,
  QItem,
  QItemSection,
  QItemSection
  QItemLabel,
  QPopover,
  QList,
} from 'quasar'
import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'

export default {
  components: {
    QItem,
    QItemSection,
    QItemSection
    QItemLabel,
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
      return null
    },
    personDeciding () {
      switch (this.application.status) {
        case 'accepted':
          return 'GROUP.ADDED_BY'
        case 'declined':
          return 'GROUP.DECLINED_BY'
      }
      return null
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
}
</script>

<style scoped lang="stylus">
@import '~variables'
.isNonPending
  opacity 0.8
</style>
