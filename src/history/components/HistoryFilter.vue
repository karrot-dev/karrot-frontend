<template>
  <div
    class="row no-wrap items-center justify-between bg-white q-pa-sm rounded-borders q-my-sm"
  >
    <QSelect
      v-model="typus"
      :options="typusOptions"
      emit-value
      map-options
      filled
      hide-bottom-space
      dense
    />
  </div>
</template>

<script setup>
import { QSelect } from 'quasar'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useQueryParams } from '@/utils/mixins/bindRoute'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  for: {
    type: String,
    default: null,
  },
})

const emit = defineEmits([
  'update:modelValue',
])

const { t } = useI18n()

const { typus } = useQueryParams({
  typus: props.modelValue || null,
})

watch(typus, value => {
  emit('update:modelValue', value)
}, {
  immediate: true,
})

const typusOptions = computed(() => [
  {
    label: t('HISTORY_FILTER.ALL'),
    value: null,
  },
  ...(props.for === 'place'
    ? [
        'STORE_CREATE',
        'STORE_MODIFY',
        'ACTIVITY_CREATE',
        'ACTIVITY_MODIFY',
        'ACTIVITY_DELETE',
        'SERIES_CREATE',
        'SERIES_MODIFY',
        'SERIES_DELETE',
        'ACTIVITY_DONE',
        'ACTIVITY_JOIN',
        'ACTIVITY_LEAVE',
        'ACTIVITY_MISSED',
        'ACTIVITY_DISABLE',
        'ACTIVITY_ENABLE',
      ]
    : [
        'GROUP_CREATE',
        'GROUP_MODIFY',
        'GROUP_JOIN',
        'GROUP_LEAVE',
        'STORE_CREATE',
        'STORE_MODIFY',
        'STORE_DELETE',
        'ACTIVITY_CREATE',
        'ACTIVITY_MODIFY',
        'ACTIVITY_DELETE',
        'SERIES_CREATE',
        'SERIES_MODIFY',
        'SERIES_DELETE',
        'ACTIVITY_DONE',
        'ACTIVITY_JOIN',
        'ACTIVITY_LEAVE',
        'ACTIVITY_MISSED',
        'APPLICATION_DECLINED',
        'MEMBER_BECAME_EDITOR',
        'ACTIVITY_DISABLE',
        'ACTIVITY_ENABLE',
        'GROUP_LEAVE_INACTIVE',
        'GROUP_CHANGE_PHOTO',
        'GROUP_DELETE_PHOTO',
        'MEMBER_REMOVED',
        'ACTIVITY_TYPE_CREATE',
        'ACTIVITY_TYPE_MODIFY',
        'ACTIVITY_TYPE_DELETE',
        'USER_LOST_EDITOR_ROLE',
        'PLACE_TYPE_CREATE',
        'PLACE_TYPE_MODIFY',
        'PLACE_TYPE_DELETE',
        'AGREEMENT_CREATE',
        'AGREEMENT_MODIFY',
        'MEMBER_GOT_ROLE',
      ]).map(typus => ({
    label: t(`HISTORY_FILTER.${typus}`),
    value: typus,
  })),
])
</script>
