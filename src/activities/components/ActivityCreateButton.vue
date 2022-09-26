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
    :title="$t('BUTTON.CREATE')"
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
      <Component
        :is="isSeries ? ActivitySeriesEdit : ActivityEdit"
        :value="isSeries ? newSeries : newActivity"
        :status="isSeries ? createSeriesStatus : createActivityStatus"
        can-cancel
        @save="data => isSeries ? saveNewSeries(data) : saveNewActivity(data)"
        @cancel="isOpen = false"
        @reset="() => isSeries ? resetNewSeries() : resetNewSeries()"
      >
        <QSelect
          v-model="placeId"
          :options="places.map(({ name, id, placeType }) => ({ label: name, value: id, icon: getPlaceTypeById(placeType).icon }))"
          :label="$t('CREATEACTIVITY.PLACE')"
          emit-value
          map-options
        >
          <template #option="scope">
            <QItem
              :key="scope.index"
              dense
              v-bind="scope.itemProps"
            >
              <QItemSection side>
                <QIcon
                  :name="scope.opt.icon"
                  size="1.1em"
                  color="positive"
                />
              </QItemSection>
              <QItemSection>
                <QItemLabel>{{ scope.opt.label }}</QItemLabel>
              </QItemSection>
            </QItem>
          </template>
          <template #selected-item="scope">
            <div class="row no-wrap ellipsis">
              <QIcon
                :name="scope.opt.icon"
                size="1.1em"
                class="on-left q-ml-xs"
                color="positive"
              />
              <div class="ellipsis">
                {{ scope.opt.label }}
              </div>
            </div>
          </template>
        </QSelect>
        <QOptionGroup
          v-model="isSeries"
          :options="[
            { label: $t('ACTIVITYMANAGE.SINGLE'), value: false },
            { label: $t('ACTIVITYMANAGE.SERIES'), value: true },
          ]"
          color="primary"
          inline
        />
      </Component>
    </div>
  </QDialog>
</template>

<script setup>
import addHours from 'date-fns/addHours'
import addSeconds from 'date-fns/addSeconds'
import startOfTomorrow from 'date-fns/startOfTomorrow'
import {
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QFab,
  QFabAction,
  QDialog,
  QSelect,
  QOptionGroup,
} from 'quasar'
import { ref, computed, watch, unref, defineAsyncComponent } from 'vue'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useCreateActivityMutation, useCreateActivitySeriesMutation } from '@/activities/mutations'
import { useActivityTypeService } from '@/activities/services'
import { defaultDuration } from '@/activities/settings'
import { useCurrentGroupService } from '@/group/services'
import { usePlaceService, usePlaceTypeService } from '@/places/services'

const ActivityEdit = defineAsyncComponent(() => import('./ActivityEdit.vue'))
const ActivitySeriesEdit = defineAsyncComponent(() => import('./ActivitySeriesEdit.vue'))

const isOpen = ref(false)
const placeId = ref(null)
const isSeries = ref(false)

const newActivity = ref({})
const newSeries = ref({})

const {
  groupId,
} = useCurrentGroupService()

const {
  getPlacesByGroup,
} = usePlaceService()

const {
  getPlaceTypeById,
} = usePlaceTypeService()

const places = computed(() => getPlacesByGroup(groupId).filter(place => place.status === 'active'))

const {
  mutate: saveNewActivity,
  status: createActivityStatus,
  reset: resetNewActivity,
} = useCreateActivityMutation({
  onSuccess () {
    isOpen.value = false
  },
})

const {
  mutate: saveNewSeries,
  reset: resetNewSeries,
  status: createSeriesStatus,
} = useCreateActivitySeriesMutation({
  onSuccess () {
    isOpen.value = false
  },
})

const {
  getIconProps,
} = useActivityTypeHelpers()

const {
  getActivityTypesByGroup,
} = useActivityTypeService()

const activityTypes = computed(() => getActivityTypesByGroup(groupId, { status: 'active' }))

watch(placeId, id => {
  // replace object to trigger 'value' watcher in editMixin
  newActivity.value = {
    ...newActivity.value,
    place: unref(id),
  }
  newSeries.value = {
    ...newSeries.value,
    place: unref(id),
  }
})

function selectActivityTypeAndOpen (activityType) {
  createNewActivity(activityType.id)
  createNewSeries(activityType.id)
  resetNewSeries()
  resetNewActivity()
  isOpen.value = true
}

function createNewActivity (activityType) {
  const date = addHours(startOfTomorrow(), 10) // default to 10am tomorrow
  newActivity.value = {
    activityType,
    participantTypes: [
      {
        role: 'member',
        maxParticipants: 2,
        description: '',
      },
    ],
    maxParticipants: 2,
    description: '',
    place: unref(placeId),
    date,
    dateEnd: addSeconds(date, defaultDuration),
    hasDuration: false,
  }
}

function createNewSeries (activityType) {
  newSeries.value = {
    activityType,
    participantTypes: [
      {
        role: 'member',
        maxParticipants: 2,
        description: '',
      },
    ],
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
  }
}
</script>
