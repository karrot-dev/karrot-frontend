<template>
  <QCard
    class="no-mobile-margin no-shadow grey-border"
  >
    <RandomArt
      :seed="group.id"
      type="circles">
      <div class="art-overlay"/>
    </RandomArt>
    <QList link>
      <QListHeader>{{ $t('GROUP.EMAIL_NOTIFICATIONS') }}</QListHeader>
      <VerificationWarning class="generic-margin" />
      <QItem
        tag="label"
        v-for="type in availableNotificationTypes"
        :key="type"
      >
        <QItemSide>
          <QCheckbox
            :value="notificationIsEnabled(type)"
            @input="change(type, arguments[0])"
          />
        </QItemSide>
        <QItemMain>
          <QItemTile label>{{ $t('GROUP.NOTIFICATION_TYPES.' + type + '.NAME') }}</QItemTile>
          <QItemTile sublabel>{{ $t('GROUP.NOTIFICATION_TYPES.' + type + '.DESCRIPTION') }}</QItemTile>
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
      required: true,
    },
  },
  data () {
    return {
      availableNotificationTypes: ['weekly_summary', 'daily_pickup_notification', 'new_application'],
    }
  },
  methods: {
    change (notificationType, enabled) {
      this.$emit('changeNotificationType', { notificationType, enabled })
    },
    notificationIsEnabled (type) {
      return this.group.notificationTypes.indexOf(type) !== -1
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
