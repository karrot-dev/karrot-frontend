<template>
  <QTable
    :columns="columns"
    :rows="activityTypes"
    hide-pagination
    :pagination="{ rowsPerPage: 0 }"
    flat
    @row-click="edit"
  >
    <template #top-left>
      <QToggle
        v-model="showArchived"
        :label="$t('ACTIVITY_TYPES.SHOW_ARCHIVED')"
      />
    </template>
    <template #top-right>
      <QBtn
        round
        color="green"
        icon="fas fa-plus"
        :title="$t('ACTIVITY_TYPES.ADD')"
        @click="create"
      />
    </template>
    <template #body-cell-icon="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <QIcon
          size="md"
          v-bind="getIconProps(props.row)"
        />
      </QTd>
    </template>
    <template #body-cell-feedback="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <QIcon
          v-show="props.row.hasFeedback"
          size="md"
          v-bind="getFeedbackIconProps(props.row)"
        />
      </QTd>
    </template>
    <template #body-cell-feedbackWeight="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <span v-show="props.row.hasFeedback && props.row.hasFeedbackWeight">
          <QIcon
            name="fas fa-check"
            color="positive"
          />
        </span>
      </QTd>
    </template>
    <template #body-cell-isArchived="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <QBadge
          :color="props.value ? 'grey' : 'green'"
        >
          {{ props.value ? t('LABELS.ARCHIVED') : t('LABELS.ACTIVE') }}
        </QBadge>
      </QTd>
    </template>
  </QTable>
</template>

<script setup>
import { Platform, QBadge, QBtn, QIcon, QTable, QTd, QToggle } from 'quasar'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActivityTypeHelpers, useActivityTypes } from '@/activities/helpers'
import { useCurrentGroupService } from '@/group/services'
import { openDialog } from '@/utils/forms'

import ActivityTypeForm from '@/group/components/ActivityTypeForm.vue'

const { t } = useI18n()

const { getTranslatedName, getIconProps, getFeedbackIconProps, sortByTranslatedName } = useActivityTypeHelpers()

const showArchived = ref(false)

const { groupId } = useCurrentGroupService()

const allActivityTypes = useActivityTypes(groupId)

const activityTypes = computed(() => {
  return allActivityTypes.value.filter(activityType => showArchived.value || !activityType.isArchived).sort(sortByTranslatedName)
})

const columns = computed(() => [
  {
    name: 'icon',
    align: 'center',
    autoWidth: true,
  },
  {
    name: 'name',
    label: t('ACTIVITY_TYPES.NAME'),
    field: row => getTranslatedName(row),
    align: 'left',
    classes: 'text-weight-bold',
  },
  {
    name: 'description',
    label: t('LABELS.DESCRIPTION'),
    field: row => row.description,
    align: 'left',
    style: 'max-width: 200px',
    classes: 'ellipsis',
  },
  {
    name: 'feedback',
    label: t('ACTIVITY_TYPES.FEEDBACK'),
    align: 'center',
    autoWidth: true,
  },
  {
    name: 'feedbackWeight',
    label: t('ACTIVITY_TYPES.FEEDBACK_WEIGHT'),
    field: row => row.hasFeedbackWeight,
    align: 'center',
    autoWidth: true,
    hideOnMobile: true,
  },
  showArchived.value && { // don't need to see status unless we're viewing all ...
    name: 'isArchived',
    label: t('ACTIVITY_TYPES.STATUS'),
    field: row => row.isArchived,
    align: 'left',
    autoWidth: true,
  },
].filter(Boolean).filter(col => !(Platform.is.mobile && col.hideOnMobile)))

function create () {
  openDialog(ActivityTypeForm, {
    activityType: {
      name: '',
      nameIsTranslatable: true,
      description: '',
      colour: '455a64', // blue-grey / 8
      icon: 'fas fa-asterisk',
      feedbackIcon: 'fas fa-reply',
      hasFeedback: false,
      hasFeedbackWeight: false,
    },
  })
}

function edit (_, activityType) {
  openDialog(ActivityTypeForm, {
    activityType,
  })
}
</script>
