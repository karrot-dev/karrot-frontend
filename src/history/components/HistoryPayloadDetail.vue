<template>
  <QItem
    v-if="label === 'participants'"
  >
    <QItemSection>
      <QItemLabel caption>
        {{ label }}
      </QItemLabel>
      <QItemLabel>
        <ProfilePicture
          v-for="user in participantUsers"
          :key="user.id"
          :user="user"
          class="inline-block"
        />
      </QItemLabel>
    </QItemSection>
  </QItem>

  <QItem
    v-else-if="label === 'date'"
  >
    <QItemSection>
      <QItemLabel caption>
        {{ $t('CREATEACTIVITY.DATE') }}
      </QItemLabel>
      <QItemLabel>
        {{ $d(firstValue, 'long') }}
      </QItemLabel>
    </QItemSection>
  </QItem>

  <QItem
    v-else
  >
    <QItemSection>
      <QItemLabel caption>
        {{ convertedLabel }}
      </QItemLabel>
      <QItemLabel
        v-if="value !== null || value !== undefined"
      >
        <template v-if="firstValue instanceof Date">
          {{ $d(firstValue, 'long') }}
        </template>
        <template v-else>
          {{ value }}
        </template>
      </QItemLabel>
      <QItemLabel
        v-else
        color="grey"
        icon="fas fa-question-circle"
      />
    </QItemSection>
  </QItem>
</template>

<script setup>
import {
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUserService } from '@/users/services'

import ProfilePicture from '@/users/components/ProfilePicture.vue'

const props = defineProps({
  label: {
    required: true,
    type: String,
  },
  value: {
    type: [Array, String, Date, Number, Boolean],
    default: null,
  },
})

const { t } = useI18n()

const firstValue = computed(() => {
  return Array.isArray(props.value) ? props.value[0] : props.value
})

const convertedLabel = computed(() => {
  if (props.label === 'description') return t('GROUP.DESCRIPTION')
  return props.label
})

const { getUserById } = useUserService()

const participantUsers = computed(() => {
  if (props.label !== 'participants') return
  return props.value?.map(entry => getUserById(entry.user)) ?? []
})

</script>
