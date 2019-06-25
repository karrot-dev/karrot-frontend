<template>
  <QCard
    v-if="group"
    id="notifications"
    class="no-shadow grey-border"
  >
    <QCardTitle>{{ $t('GROUP.NOTIFICATIONS_BY_GROUP') }}</QCardTitle>
    <template v-if="groups.length > 1">
      <div class="row q-pl-md">
        <div
          class="q-pb-md q-caption-opacity"
        >
          {{ $t('SWITCHGROUP.CHOOSE') }}
        </div>
        <SwitchGroupButton
          class="q-ml-md"
          :user="{ isCurrentUser: true }"
          :groups="groups"
          @selectGroup="$emit('selectGroup', arguments[0])"
        />
      </div>
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
        <div
          class="q-pt-md q-pl-md"
        >
          <QBtn
            color="primary"
            :label="$t('UNSUBSCRIBE.ALL')"
            :loading="isPending"
            @click="$emit('unsubscribeAllEmails', group.id)"
          />
          <div
            class="q-pt-sm q-caption-opacity"
          >
            {{ $t('UNSUBSCRIBE.FROM_GROUP', { groupName: group.name }) }}
          </div>
        </div>
        <div
          v-if="hasAnyError"
          class="text-negative q-mt-md"
        >
          <i class="fas fa-exclamation-triangle" />
          {{ anyFirstError }}
        </div>
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
  QBtn,
} from 'quasar'
import SwitchGroupButton from '@/users/components/SwitchGroupButton'
import statusMixin from '@/utils/mixins/statusMixin'

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
    QBtn,
    SwitchGroupButton,
  },
  mixins: [statusMixin],
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
  watch: {
    group (val, oldval) {
      if (!val || !oldval || val.id !== oldval.id) {
        this.$emit('clearUnsubscribeAllStatus')
      }
    },
  },
  methods: {
    change (notificationType, enabled) {
      this.$emit('changeNotificationType', { notificationType, enabled })
    },
    notificationIsEnabled (type) {
      if (!this.group) return
      return this.group.notificationTypes.includes(type)
    },
  },
}
</script>
