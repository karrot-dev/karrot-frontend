<template>
  <q-item
    highlight
    separator
    :class="{ isPending: application.isPending, isNonPending: !application.isPending }"
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
        {{ itemSublabel }}
      </q-item-tile>
      <q-item-tile
        v-if="application.status !== 'pending'"
        sublabel
        lines="1"
      >
        {{ this.application.status }}
      </q-item-tile>
    </q-item-main>
    <q-item-side
      right
    >
      <q-btn
        round
        disable
        color="tertiary"
        icon="fas fa-comments"
        class="generic-margin"
        @click="openChat"
      />
      <q-btn
        v-if="application.canDecide"
        round
        color="positive"
        icon="fas fa-check"
        class="generic-margin"
        @click="pressAccept"
      />
      <q-btn
        v-if="application.canDecide"
        round
        color="negative"
        icon="fas fa-times"
        class="generic-margin"
        @click="decline"
      />
    </q-item-side>
  </q-item>
</template>

<script>
import { Dialog, QItem, QBtn, QItemMain, QItemSide, QItemTile } from 'quasar'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'

export default {
  components: {
    QItem, QBtn, QItemMain, QItemSide, QItemTile, ProfilePicture,
  },
  props: {
    application: {
      required: true,
      type: Object,
    },
  },
  methods: {
    openChat () {
      return console.log('This will lead to the ApplicationChat soon!')
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
    itemSublabel () {
      const date = this.$d(this.application.createdAt, 'long')
      return this.$t('APPLICATION.SUBMITTED_ON', { date: date })
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
