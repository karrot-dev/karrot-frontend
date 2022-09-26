<template>
  <QBtn
    icon="fas fa-pencil-alt"
    color="white"
    text-color="grey-8"
    size="xs"
    round
    unelevated
    :title="$t('BUTTON.EDIT')"
    @click="isOpen = true"
  >
    <QDialog
      v-model="isOpen"
      full-height
    >
      <div
        class="bg-white"
        style="width: 700px; overflow-x: hidden"
      >
        <QTabs
          v-model="tab"
        >
          <QTab
            name="activity"
            :label="$t('EDIT ACTIVITY')"
          />
          <QTab
            name="series"
            :label="$t('EDIT SERIES')"
          />
        </QTabs>
        <QSeparator />
        <QTabPanels
          v-model="tab"
          animated
        >
          <QTabPanel name="activity">
            <ActivityEdit
              :value="activity"
              :status="saveActivityStatus"
              can-cancel
              @save="saveActivity"
              @cancel="isOpen = false"
              @reset="resetActivity"
            />
          </QTabPanel>
          <QTabPanel name="series">
            <ActivitySeriesEdit
              :value="activitySeries"
              :status="saveSeriesStatus"
              can-cancel
              @save="saveSeries"
              @cancel="isOpen = false"
              @reset="resetSeries"
              @destroy="destroySeries"
            />
          </QTabPanel>
        </QTabPanels>
      </div>
    </QDialog>
  </QBtn>
</template>

<script setup>
import {
  QDialog,
  QBtn,
  QTabs,
  QTab,
  QSeparator,
  QTabPanels,
  QTabPanel,
} from 'quasar'
import { ref, computed, watch, unref } from 'vue'

import { useSaveActivityMutation, useSaveActivitySeriesMutation, useDestroyActivitySeriesMutation } from '@/activities/mutations'
import { useActivitySeriesItemQuery } from '@/activities/queries'

import ActivityEdit from './ActivityEdit.vue'
import ActivitySeriesEdit from './ActivitySeriesEdit.vue'

const props = defineProps({
  activity: {
    type: Object,
    required: true,
  },
})

const isOpen = ref(false)
const tab = ref('activity')

const {
  activitySeries,
} = useActivitySeriesItemQuery({
  id: props.activity.series,
  enabled: isOpen,
})

const {
  mutate: saveActivity,
  status: saveActivityStatus,
  reset: resetActivity,
} = useSaveActivityMutation({
  onSuccess () {
    isOpen.value = false
  },
})

const {
  mutate: saveSeries,
  reset: resetSeries,
  status: saveSeriesStatus,
} = useSaveActivitySeriesMutation({
  onSuccess () {
    console.log('onsuccess')
    isOpen.value = false
  },
})

const {
  mutateAsync: destroySeries,
} = useDestroyActivitySeriesMutation()
</script>
