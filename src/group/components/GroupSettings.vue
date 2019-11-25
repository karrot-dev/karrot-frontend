<template>
  <QCard
    v-if="group"
    id="notifications"
    class="no-shadow grey-border"
  >
    <QCardSection>
      <div class="text-h6">
        {{ $t('GROUP.NOTIFICATIONS_BY_GROUP') }}
      </div>
    </QCardSection>
    <template v-if="groups.length > 1">
      <div class="row q-pl-md">
        <div
          class="q-pb-md k-caption-opacity"
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
    <QCardSection>
      <QList>
        <QItemLabel header>
          <div class="text-weight-medium">
            {{ $t('GROUP.EMAIL_NOTIFICATIONS') }}
          </div>
        </QItemLabel>
        <QItem
          v-for="type in availableNotificationTypes"
          :key="type"
          tag="label"
        >
          <QItemSection side>
            <QCheckbox
              :value="notificationIsEnabled(type)"
              @input="change(type, arguments[0])"
            />
          </QItemSection>
          <QItemSection>
            <QItemLabel>
              {{ $t('GROUP.NOTIFICATION_TYPES.' + type + '.NAME') }}
            </QItemLabel>
            <QItemLabel caption>
              {{ $t('GROUP.NOTIFICATION_TYPES.' + type + '.DESCRIPTION') }}
            </QItemLabel>
          </QItemSection>
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
            class="q-pt-sm k-caption-opacity"
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
    </QCardSection>
  </QCard>
</template>

<script>
import {
  QCard,
  QCardSection,
  QCheckbox,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QBtn,
} from 'quasar'
import SwitchGroupButton from '@/users/components/SwitchGroupButton'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  name: 'GroupSettings',
  components: {
    QCard,
    QCardSection,
    QCheckbox,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
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
      availableNotificationTypes: ['weekly_summary', 'daily_pickup_notification', 'new_application', 'new_offer', 'conflict_resolution'],
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
