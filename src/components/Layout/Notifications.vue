<template>
  <component
    :is="asPage ? 'q-card' : 'div'"
    class="bg-white"
  >
    <q-list no-border>
      <div
        v-if="asPopover"
        class="row justify-end q-mb-sm q-mr-sm"
      >
        <q-btn
          v-close-overlay
          size="sm"
          color="secondary"
          :to="{ name: 'notifications' }"
        >
          {{ $t('BUTTON.SHOW_MORE') }}
        </q-btn>
      </div>
      <q-item
        v-if="notifications.length === 0"
      >
        {{ $t('NOTIFICATIONS_BELLS_LIST.NO_ITEMS') }}
      </q-item>
      <NotificationItem
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @open="open"
      />
      <q-item
        v-if="!asPopover && canFetchPast"
        class="row justify-center"
      >
        <q-btn
          size="sm"
          :loading="fetchingPast"
          @click="fetchPast"
        >
          {{ $t('BUTTON.SHOW_MORE') }}
        </q-btn>
      </q-item>
    </q-list>
  </component>
</template>

<script>
import {
  QCard,
  QList,
  QListHeader,
  QItemSeparator,
  QItem,
  QBtn,
} from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import NotificationItem from './NotificationItem'

export default {
  components: {
    QCard,
    QList,
    QListHeader,
    QItemSeparator,
    QItem,
    QBtn,
    NotificationItem,
  },
  props: {
    asPage: {
      type: Boolean,
      default: false,
    },
    asPopover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      notifications: 'notifications/current',
      canFetchPast: 'notifications/canFetchPast',
      fetchingPast: 'notifications/fetchingPast',
    }),
  },
  methods: {
    ...mapActions({
      fetchPast: 'notifications/fetchPast',
      markClicked: 'notifications/markClicked',
      setPageVisible: 'notifications/setPageVisible',
    }),
    open (notification) {
      const { type, context } = notification
      if (!type || !context) return

      this.markClicked(notification)

      switch (type) {
        case 'user_became_editor':
        case 'invitation_accepted':
        case 'new_member':
          return this.$router.push({ name: 'user', params: { userId: context.user.id } })
        case 'you_became_editor': // TODO show information about editing permissions
        case 'application_accepted':
          return this.$router.push({ name: 'group', params: { groupId: context.group.id } })
        case 'new_applicant':
          return this.$router.push({ name: 'groupApplications', params: { groupId: context.group.id } })
        case 'feedback_possible':
          return this.$router.push({ name: 'giveFeedback', params: { groupId: context.group.id, pickupId: context.pickup.id } })
        case 'application_declined':
          return this.$router.push({ name: 'groupPreview', params: { groupPreviewId: context.group.id } })
        case 'new_store':
          return this.$router.push({ name: 'store', params: { groupId: context.group.id, storeId: context.store.id } })
      }
    },
  },
  mounted () {
    this.setPageVisible(true)
  },
  beforeDestory () {
    this.setPageVisible(false)
  },
}
</script>
