<template>
  <QCard
    v-if="group"
    class="no-mobile-margin no-shadow grey-border"
  >
    <RandomArt
      :seed="group.id"
      type="circles"
    >
      <div class="art-overlay" />
    </RandomArt>
    <QList link>
      <QListHeader>{{ $t('GROUP.EMAIL_NOTIFICATIONS') }}</QListHeader>
      <VerificationWarning class="generic-margin" />
      <QItem
        v-for="type in availableNotificationTypes"
        :key="type"
        tag="label"
      >
        <QItemSide>
          <QCheckbox
            :value="notificationIsEnabled(type)"
            @input="change(type, arguments[0])"
          />
        </QItemSide>
        <QItemMain>
          <QItemTile label>
            {{ $t('GROUP.NOTIFICATION_TYPES.' + type + '.NAME') }}
          </QItemTile>
          <QItemTile sublabel>
            {{ $t('GROUP.NOTIFICATION_TYPES.' + type + '.DESCRIPTION') }}
          </QItemTile>
        </QItemMain>
      </QItem>
    </QList>
  </QCard>
</template>

<script>
import { QCard, QCheckbox, QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile } from 'quasar'
import VerificationWarning from '@/authuser/components/Settings/VerificationWarning'
import RandomArt from '@/utils/components/RandomArt'

export default {
  name: 'GroupSettings',
  components: { RandomArt, VerificationWarning, QCard, QCheckbox, QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile },
  props: {
    group: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      availableNotificationTypes: ['weekly_summary', 'daily_pickup_notification', 'new_application', 'conflict_resolution'],
    }
  },
  methods: {
    change (notificationType, enabled) {
      this.$emit('changeNotificationType', { notificationType, enabled })
    },
    notificationIsEnabled (type) {
      if (!this.group) return
      return this.group.notificationTypes.indexOf(type) !== -1
    },
  },
}
</script>
