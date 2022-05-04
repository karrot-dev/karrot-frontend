<template>
  <QItem
    :class="{ isNonPending: !application.isPending }"
    clickable
    @click="$emit('open-chat', application)"
  >
    <QItemSection side>
      <ProfilePicture
        :user="application.user"
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
          :keypath="decision"
        >
          <template #relativeDate>
            <DateAsWords
              v-if="application.decidedAt"
              style="display: inline"
              :date="application.decidedAt"
            />
          </template>
        </i18n-t>
        <template v-if="application.status !== 'withdrawn'">
          <br>
          <i18n-t
            :keypath="personDeciding"
          >
            <template #userName>
              <RouterLink
                :to="{name: 'user', params: { userId: application.decidedBy.id }}"
                @click.stop
              >
                {{ application.decidedBy.displayName }}
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
import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'

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
  emits: [
    'open-chat',
  ],
  computed: {
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
