<template>
  <div
    class="bg-white"
  >
    <KSpinner v-show="fetching" />
    <QList>
      <QItem
        v-if="!fetching && notifications.length === 0"
      >
        {{ $t('NOTIFICATION_BELLS_LIST.NO_ITEMS') }}
      </QItem>
      <NotificationItem
        v-for="notification in notifications"
        :key="notification.id"
        v-close-popup
        :notification="notification"
        @click="markClicked"
      />
      <div
        v-if="asPopover"
        class="row justify-end q-my-sm q-mr-sm"
      >
        <QBtn
          v-close-popup
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
  </div>
</template>

<script>
import {
  QList,
  QItem,
  QBtn,
} from 'quasar'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import NotificationItem from './NotificationItem'
import KSpinner from '@/utils/components/KSpinner'

export default {
  components: {
    QList,
    QItem,
    QBtn,
    NotificationItem,
    KSpinner,
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
      fetching: 'notifications/fetching',
      canFetchPast: 'notifications/canFetchPast',
      fetchingPast: 'notifications/fetchingPast',
    }),
  },
  mounted () {
    this.setPageVisible(true)
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
  beforeDestory () {
    this.setPageVisible(false)
  },
}
</script>
