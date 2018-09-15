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
        {{ $t('NOTIFICATIONS.BELLS.NO_BELLS') }}
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
      fetchPastConversations: 'notifications/fetchPast',
    }),
    open () {
      console.log('do something!')
    },
  },
}
</script>
