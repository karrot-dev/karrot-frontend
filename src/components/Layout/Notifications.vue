<template>
  <component
    :is="asPage ? 'q-card' : 'div'"
    class="bg-white"
  >
    <q-list no-border>
      <q-item
        v-if="notifications.length === 0"
      >
        {{ $t('NOTIFICATION_BELLS_LIST.NO_ITEMS') }}
      </q-item>
      <NotificationItem
        v-close-overlay
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @click="markClicked"
        :to="{ name: 'wall' }"
      />
      <div
        v-if="asPopover"
        class="row justify-end q-mt-sm q-mr-sm"
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
  },
  mounted () {
    this.setPageVisible(true)
  },
  beforeDestory () {
    this.setPageVisible(false)
  },
}
</script>
