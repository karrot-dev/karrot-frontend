<template>
  <KFormContainer
    v-if="group"
    id="notifications"
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
          :user="user"
          :groups="groups"
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
              :model-value="notificationIsEnabled(type)"
              :disable="notificationIsPending(type)"
              :title="$t('GROUP.NOTIFICATION_TYPES.' + type + '.NAME')"
              @update:model-value="value => change(type, value)"
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
          <QItemSection side>
            <QSpinner
              :class="{ invisible: !notificationIsPending(type) }"
              size="xs"
            />
          </QItemSection>
        </QItem>
        <div
          class="q-pt-md q-pl-md"
        >
          <QBtn
            color="primary"
            :label="$t('UNSUBSCRIBE.ALL')"
            :loading="unsubscribeIsPending"
            @click="unsubscribeAll(group.id)"
          />
          <div
            class="q-pt-sm k-caption-opacity"
          >
            {{ $t('UNSUBSCRIBE.FROM_GROUP', { groupName: group.name }) }}
          </div>
        </div>
        <div
          v-if="unsubscribeHasAnyError"
          class="text-negative q-mt-md"
        >
          <i class="fas fa-exclamation-triangle" />
          {{ unsubscribeAnyFirstError }}
        </div>
      </QList>
    </QCardSection>
  </KFormContainer>
</template>

<script>
import {
  QCardSection,
  QCheckbox,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QBtn,
  QSpinner,
} from 'quasar'
import { computed } from 'vue'

import { useUnsubscribeAllMutation } from '@/authuser/mutations'
import { useAuthService } from '@/authuser/services'
import { useChangeNotificationTypesMutation } from '@/group/mutations'
import { useCurrentGroupService } from '@/group/services'
import { useGroupInfoService } from '@/groupInfo/services'
import { useStatusHelpers } from '@/utils/mixins/statusMixin'

import KFormContainer from '@/base/components/KFormContainer'
import SwitchGroupButton from '@/users/components/SwitchGroupButton'

export default {
  name: 'GroupSettings',
  components: {
    QCardSection,
    QCheckbox,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QBtn,
    QSpinner,
    KFormContainer,
    SwitchGroupButton,
  },
  setup () {
    const { user } = useAuthService()
    const {
      groupId,
      group,
    } = useCurrentGroupService()
    const { groups: allGroups } = useGroupInfoService()
    const groups = computed(() => allGroups.value.filter(group => group.isMember))

    const {
      mutateAsync: changeNotificationType,
    } = useChangeNotificationTypesMutation({ groupId })

    const {
      mutate: unsubscribeAll,
      status: unsubscribeAllStatus,
      reset: resetUnsubscribeAll,
    } = useUnsubscribeAllMutation()

    const {
      hasAnyError: unsubscribeHasAnyError,
      anyFirstError: unsubscribeAnyFirstError,
      isPending: unsubscribeIsPending,
    } = useStatusHelpers(unsubscribeAllStatus)

    return {
      group,
      groups,
      user,
      changeNotificationType,
      unsubscribeAll,
      unsubscribeHasAnyError,
      unsubscribeAnyFirstError,
      unsubscribeIsPending,
      resetUnsubscribeAll,
    }
  },
  data () {
    return {
      notificationTypePending: {},
    }
  },
  computed: {
    availableNotificationTypes () {
      if (!this.group) return []
      return [
        'weekly_summary',
        'daily_activity_notification',
        'new_application',
        ...(this.group.features.includes('offers') ? ['new_offer'] : []),
        'membership_review',
      ]
    },
  },
  watch: {
    group (val, oldval) {
      if (!val || !oldval || val.id !== oldval.id) {
        this.resetUnsubscribeAll()
      }
    },
  },
  methods: {
    async change (notificationType, enabled) {
      try {
        this.notificationTypePending[notificationType] = true
        await this.changeNotificationType({ notificationType, enabled })
      }
      finally {
        delete this.notificationTypePending[notificationType]
      }
    },
    notificationIsEnabled (type) {
      if (!this.group) return
      return this.group.notificationTypes.includes(type)
    },
    notificationIsPending (type) {
      return Boolean(this.notificationTypePending[type])
    },
  },
}
</script>
