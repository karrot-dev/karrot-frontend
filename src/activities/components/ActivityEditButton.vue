<template>
  <QFab
    class="fab-top-fix"
    vertical-actions-align="right"
    size="sm"
    color="secondary"
    icon="fas fa-plus"
    direction="down"
    unelevated
    padding="0px 13px"
  >
    <QFabAction
      v-for="activityType in activityTypes"
      :key="activityType.id"
      class="fab-action-fix"
      label-position="left"
      v-bind="getIconProps(activityType)"
      @click="selectActivityTypeAndOpen(activityType)"
    />
    <QFabAction
      class="fab-action-fix bg-white"
      :label="$t('ACTIVITY_TYPES.MANAGE_TYPES')"
      outline
      :to="{ name: 'groupEditActivityTypes' }"
    />
  </QFab>
  <QDialog
    v-model="isOpen"
  >
    <div
      class="bg-white"
      style="width: 700px; overflow-x: hidden"
    >
      <ActivityEdit
        v-if="!isSeries"
        :value="newActivity"
        :status="createActivityStatus"
        @save="saveNewActivity"
        @cancel="isOpen = false"
        @reset="resetNewActivity"
      >
        <QSelect
          v-model="placeId"
          :options="places.map(({ name, id}) => ({ label: name, value: id }))"
          :label="$t('CREATEACTIVITY.PLACE')"
          emit-value
          map-options
        />
        <QOptionGroup
          v-model="isSeries"
          :options="[
            { label: 'one-time', value: false },
            { label: 'recurring', value: true },
          ]"
          color="primary"
          inline
        />
      </ActivityEdit>
      <ActivitySeriesEdit
        v-else
        :value="newSeries"
        :status="createSeriesStatus"
        @save="saveNewSeries"
        @cancel="isOpen = false"
        @reset="resetNewSeries"
      >
        <QSelect
          v-model="placeId"
          :options="places.map(({ name, id}) => ({ label: name, value: id }))"
          :label="$t('CREATEACTIVITY.PLACE')"
          emit-value
          map-options
        />
        <QOptionGroup
          v-model="isSeries"
          :options="[
            { label: 'one-time', value: false },
            { label: 'recurring', value: true },
          ]"
          color="primary"
          inline
        />
      </ActivitySeriesEdit>
    </div>
  </QDialog>
</template>

<script setup>
import addHours from 'date-fns/addHours'
import addSeconds from 'date-fns/addSeconds'
import startOfTomorrow from 'date-fns/startOfTomorrow'
import {
  QAvatar,
  QField,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QList,
  QBtn,
  QMenu,
  QSeparator,
  QInnerLoading,
  QFab,
  QFabAction,
  QDialog,
  QSelect,
  QOptionGroup,
} from 'quasar'
import { ref, computed, reactive, watch, unref } from 'vue'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useCreateActivityMutation, useCreateActivitySeriesMutation } from '@/activities/mutations'
import { useActivityTypeService } from '@/activities/services'
import { defaultDuration } from '@/activities/settings'
import { useCurrentGroupService } from '@/group/services'
import { usePlaceService } from '@/places/services'

import ActivityEdit from './ActivityEdit.vue'
import ActivitySeriesEdit from './ActivitySeriesEdit.vue'

const isOpen = ref(false)
const placeId = ref()
const isSeries = ref(false)

const newActivity = reactive({})
const newSeries = reactive({})

const {
  groupId,
} = useCurrentGroupService()

const {
  getPlacesByGroup,
} = usePlaceService()

const places = computed(() => getPlacesByGroup(groupId))

const {
  mutateAsync: saveNewActivity, // using the async version as we await the result later
  status: createActivityStatus,
  reset: resetNewActivity,
} = useCreateActivityMutation()

const {
  mutate: saveNewSeries,
  reset: resetNewSeries,
  status: createSeriesStatus,
} = useCreateActivitySeriesMutation()

const {
  getIconProps,
} = useActivityTypeHelpers()

const {
  getActivityTypeById,
  getActivityTypesByGroup,
} = useActivityTypeService()

const activityTypes = computed(() => getActivityTypesByGroup(groupId, { status: 'active' }))

watch(placeId, value => {
  newActivity.place = unref(value)
  console.log(value, unref(newActivity))
  newSeries.place = unref(value)
  newActivity.maxParticipants = 5
})

function selectActivityTypeAndOpen (activityType) {
  createNewActivity(activityType)
  createNewSeries(activityType)
  isOpen.value = true
}

function createNewActivity (activityType) {
  const date = addHours(startOfTomorrow(), 10) // default to 10am tomorrow
  Object.assign(newActivity, {
    activityType,
    maxParticipants: 2,
    description: '',
    date,
    dateEnd: addSeconds(date, defaultDuration),
    place: unref(placeId),
    hasDuration: false,
  })
}

function createNewSeries (activityType) {
  Object.assign(newSeries, {
    activityType,
    maxParticipants: 2,
    description: '',
    startDate: addHours(startOfTomorrow(), 10),
    duration: null,
    place: unref(placeId),
    rule: {
      isCustom: false,
      byDay: ['MO'],
      freq: 'WEEKLY',
    },
  })
}
</script>
