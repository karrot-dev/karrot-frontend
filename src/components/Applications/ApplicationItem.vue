<template>
  <q-item
    link
    separator
    :class="{ isPending: application.isPending, isNonPending: !application.isPending }"
    @click.native.self="openChat"
  >
    <q-item-side>
      <ProfilePicture
        :user="application.user"
        :size="80"
        class="applicants-picture"
      />
    </q-item-side>

    <q-item-main>
      <q-item-tile
        label
        lines="1"
      >
        {{ userName }}
      </q-item-tile>

      <q-item-tile
        sublabel
        lines="1"
      >
        {{ submittedOn }}
      </q-item-tile>

      <q-item-tile
        v-if="application.status !== 'pending'"
        sublabel
        lines="1"
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
          ·
          <i18n
            :path="personDeciding"
          >
            <router-link
              place="userName"
              :to="{name: 'user', params: { userId: application.decidedBy.id }}"
            >
              {{ application.decidedBy.displayName }}
            </router-link>
          </i18n>
        </template>
      </q-item-tile>

    </q-item-main>
    <q-item-side
      right
    >
      <q-btn
        round
        color="tertiary"
        icon="fas fa-comments"
        class="generic-margin"
        @click="openChat"
        :title="$t('BUTTON.OPEN')"
      />
      <q-btn
        v-if="application.status === 'pending'"
        round
        color="positive"
        icon="fas fa-check"
        class="generic-margin"
        @click="pressAccept"
        :title="$t('BUTTON.ACCEPT')"
      />
      <q-btn
        v-if="application.status === 'pending'"
        round
        color="negative"
        icon="fas fa-times"
        class="generic-margin"
        @click="decline"
        :title="$t('BUTTON.DECLINE')"
      />
    </q-item-side>
  </q-item>
</template>

<script>
import { Dialog, QItem, QBtn, QItemMain, QItemSide, QItemTile } from 'quasar'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import DateAsWords from '@/components/General/DateAsWords'

export default {
  components: {
    QItem, QBtn, QItemMain, QItemSide, QItemTile, ProfilePicture, DateAsWords,
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
.applicants-picture
  vertical-align: text-bottom
  margin-left: -0.5 rem
.isNonPending
  opacity 0.5
</style>
