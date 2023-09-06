<template>
  <QItem
    :class="{ isNonPending: !application.status !== 'pending' }"
    clickable
    @click="openApplication(application)"
  >
    <QItemSection side>
      <ProfilePicture
        :user="application.user"
        :membership="getMembership(application.user.id)"
        :size="30"
        :is-link="false"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel>
        {{ userName }}
      </QItemLabel>
      <QItemLabel caption>
        {{ submittedOn }}
      </QItemLabel>
      <QItemLabel
        v-if="application.status !== 'pending'"
        caption
      >
        <i18n-t
          scope="global"
          :keypath="decision"
        >
          <template #relativeDate>
            <DateAsWords
              v-if="application.decidedAt"
              style="display: inline"
              :date="application.decidedAt"
              :future="false"
            />
          </template>
        </i18n-t>
        <template v-if="application.status !== 'withdrawn'">
          <br>
          <i18n-t
            scope="global"
            :keypath="personDeciding"
          >
            <template #userName>
              <RouterLink
                :to="{name: 'user', params: { userId: application.decidedBy }}"
                @click.stop
              >
                {{ decidedBy.displayName }}
              </RouterLink>
            </template>
          </i18n-t>
        </template>
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<script>
import {
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'

import { useCurrentGroupService } from '@/group/services'
import { useDetailService } from '@/messages/services'
import { useUserService } from '@/users/services'

import ProfilePicture from '@/users/components/ProfilePicture.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'

export default {
  components: {
    QItem,
    QItemSection,
    QItemLabel,
    ProfilePicture,
    DateAsWords,
  },
  props: {
    application: {
      required: true,
      type: Object,
    },
  },
  setup () {
    const { getUserById } = useUserService()
    const { getMembership } = useCurrentGroupService()
    const { openApplication } = useDetailService()
    return {
      getUserById,
      getMembership,
      openApplication,
    }
  },
  computed: {
    decidedBy () {
      return this.getUserById(this.application.decidedBy)
    },
    userName () {
      return this.application.user.displayName
    },
    submittedOn () {
      const date = this.$d(this.application.createdAt, 'long')
      return this.$t('APPLICATION.SUBMITTED_ON', { date })
    },
    decision () {
      switch (this.application.status) {
        case 'accepted':
          return 'GROUP.JOINED'
        case 'declined':
          return 'GROUP.DECLINED'
        case 'withdrawn':
          return 'APPLICATION.WITHDRAWN'
      }
      return null
    },
    personDeciding () {
      switch (this.application.status) {
        case 'accepted':
          return 'GROUP.ADDED_BY'
        case 'declined':
          return 'GROUP.DECLINED_BY'
      }
      return null
    },
  },
}
</script>

<style scoped lang="sass">
.isNonPending
  opacity: 0.8
</style>
