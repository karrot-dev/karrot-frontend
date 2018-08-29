<template>
  <q-card
    class="no-mobile-margin no-shadow grey-border"
  >
    <RandomArt
      :seed="group.id"
      type="circles">
      <div class="art-overlay"/>
    </RandomArt>
    <q-list link>
      <q-list-header>{{ $t('GROUP.EMAIL_NOTIFICATIONS') }}</q-list-header>
      <VerificationWarning class="generic-margin" />
      <q-item
        tag="label"
        v-for="type in availableNotificationTypes"
        :key="type"
      >
        <q-item-side>
          <q-checkbox
            :value="notificationIsEnabled(type)"
            @input="change(type, arguments[0])"
          />
        </q-item-side>
        <q-item-main>
          <q-item-tile label>{{ $t('GROUP.NOTIFICATION_TYPES.' + type + '.NAME') }}</q-item-tile>
          <q-item-tile sublabel>{{ $t('GROUP.NOTIFICATION_TYPES.' + type + '.DESCRIPTION') }}</q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
  </q-card>
</template>

<script>
import { QCard, QCheckbox, QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile } from 'quasar'
import VerificationWarning from '@/components/Settings/VerificationWarning'
import RandomArt from '@/components/General/RandomArt'

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
