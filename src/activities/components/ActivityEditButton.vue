<template>
  <QBtn
    icon="fas fa-pencil-alt"
    color="white"
    text-color="grey-8"
    size="xs"
    round
    unelevated
    :title="$t('BUTTON.EDIT')"
  >
    <QPopupProxy>
      <QList class="bg-white">
        <QItemLabel header>
          What do you want to edit?
        </QItemLabel>
        <QItem
          v-close-popup
          clickable
          @click="editSeries = false; isOpen = true"
        >
          <QItemSection>
            Only this activity
          </QItemSection>
        </QItem>
        <QItem
          v-if="activity.series"
          v-close-popup
          clickable
          @click="editSeries = true; isOpen = true"
        >
          <QItemSection>
            Activities in this series
          </QItemSection>
        </QItem>
        <QItem
          v-close-popup
          clickable
          :to="{ name: 'placeActivitiesManage', params: { placeId: place.id } }"
        >
          <QItemSection>
            Manage all activities in <strong>{{ place.name }}</strong>
          </QItemSection>
        </QItem>
      </QList>
    </QPopupProxy>
    <QDialog
      v-model="isOpen"
    >
      <div
        class="bg-white relative-position"
        style="width: 700px; overflow-x: hidden"
      >
        <ActivityEdit
          v-if="!editSeries"
          :value="activity"
          :status="saveActivityStatus"
          can-cancel
          @save="saveActivity"
          @cancel="isOpen = false"
          @reset="resetActivity"
        />
        <ActivitySeriesEdit
          v-else-if="activitySeries"
          :value="activitySeries"
          :status="saveSeriesStatus"
          can-cancel
          @save="saveSeries"
          @cancel="isOpen = false"
          @reset="resetSeries"
          @destroy="destroySeries"
        />
        <QInnerLoading :showing="(isLoadingSeries && isFetchingSeries) || isSavingActivity || isSavingSeries || isDestroyingSeries" />
      </div>
    </QDialog>
  </QBtn>
</template>

<script setup>
import {
  QDialog,
  QBtn,
  QPopupProxy,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QInnerLoading,
} from 'quasar'
import { ref, computed, defineAsyncComponent } from 'vue'

import { useSaveActivityMutation, useSaveActivitySeriesMutation, useDestroyActivitySeriesMutation } from '@/activities/mutations'
import { useActivitySeriesItemQuery } from '@/activities/queries'

const ActivityEdit = defineAsyncComponent(() => import('./ActivityEdit.vue'))
const ActivitySeriesEdit = defineAsyncComponent(() => import('./ActivitySeriesEdit.vue'))

const props = defineProps({
  activity: {
    type: Object,
    required: true,
  },
  place: {
    type: Object,
    required: true,
  },
})

const isOpen = ref(false)
const editSeries = ref(false)

const {
  activitySeries,
  isLoading: isLoadingSeries,
  isFetching: isFetchingSeries,
} = useActivitySeriesItemQuery({
  id: props.activity.series,
  enabled: computed(() => isOpen.value && editSeries.value),
})

const {
  mutate: saveActivity,
  status: saveActivityStatus,
  reset: resetActivity,
  isLoading: isSavingActivity,
} = useSaveActivityMutation({
  onSuccess () {
    isOpen.value = false
  },
})

const {
  mutate: saveSeries,
  reset: resetSeries,
  status: saveSeriesStatus,
  isLoading: isSavingSeries,
} = useSaveActivitySeriesMutation({
  onSuccess () {
    isOpen.value = false
  },
})

const {
  mutateAsync: destroySeries,
  isLoading: isDestroyingSeries,
} = useDestroyActivitySeriesMutation({
  onSuccess () {
    isOpen.value = false
  },
})
</script>
