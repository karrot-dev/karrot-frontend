<template>
  <Component
    :is="asPage ? 'QCard' : 'div'"
    class="bg-white"
  >
    <QList no-border>
      <QItem
        v-if="notifications.length === 0"
      >
        {{ $t('NOTIFICATION_BELLS_LIST.NO_ITEMS') }}
      </QItem>
      <NotificationItem
        v-close-overlay
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @click="markClicked"
      />
      <div
        v-if="asPopover"
        class="row justify-end q-mt-sm q-mr-sm"
      >
        <QBtn
          v-close-overlay
          size="sm"
          color="secondary"
          :to="{ name: 'notifications' }"
        >
          {{ $t('BUTTON.SHOW_MORE') }}
        </QBtn>
      </div>
      <QItem
        v-if="!asPopover && canFetchPast"
        class="row justify-center"
      >
        <QBtn
          size="sm"
          :loading="fetchingPast"
          @click="fetchPast"
        >
          {{ $t('BUTTON.SHOW_MORE') }}
        </QBtn>
      </QItem>
    </QList>
  </Component>
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
import { mapGetters, mapActions, mapMutations } from 'vuex'
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
    }),
    ...mapMutations({
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
