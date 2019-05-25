<template>
  <QCard
    v-if="group"
    id="notifications"
    class="no-shadow grey-border"
  >
    <QCardTitle>{{ $t('GROUP.NOTIFICATIONS_BY_GROUP') }}</QCardTitle>
    <template v-if="groups.length > 1">
      <span
        class="q-pb-md q-pl-md q-caption-opacity"
      >
        {{ $t('SWITCHGROUP.CHOOSE') }}
      </span>
      <SwitchGroupButton
        class="q-ml-md"
        :user="{ isCurrentUser: true }"
        :groups="groups"
        @selectGroup="$emit('selectGroup', arguments[0])"
      />
    </template>
    <QCardMain>
      <QList link>
        <QListHeader>
          {{ $t('GROUP.EMAIL_NOTIFICATIONS') }}
        </QListHeader>
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
    </QCardMain>
  </QCard>
</template>

<script>
import {
  QCard,
  QCardTitle,
  QCardMain,
  QCheckbox,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
} from 'quasar'
import SwitchGroupButton from '@/users/components/SwitchGroupButton'

export default {
  name: 'GroupSettings',
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QCheckbox,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    SwitchGroupButton,
  },
  props: {
    group: {
      type: Object,
      default: null,
    },
    groups: {
      type: Array,
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
