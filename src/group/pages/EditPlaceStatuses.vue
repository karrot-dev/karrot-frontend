<template>
  <QTable
    flat
    :columns="columns"
    :rows="filteredPlaceStatus"
    row-key="id"
    hide-pagination
    :rows-per-page-options="[0]"
    @row-click="edit"
  >
    <template #top-left>
      <QToggle
        v-model="showArchived"
        :label="$t('PLACE_TYPES.SHOW_ARCHIVED')"
      />
    </template>
    <template #top-right>
      <QBtn
        round
        color="green"
        icon="fas fa-plus"
        :title="$t('PLACE_TYPES.ADD')"
        @click="createNewPlaceStatus()"
      />
    </template>
    <template #body-cell="props">
      <QTd
        :props="props"
        :auto-width="props.col.name === 'status'"
      >
        {{ props.value }}
      </QTd>
    </template>
    <template #body-cell-colour="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <QIcon
          size="sm"
          :color="props.value"
          name="fa fa-circle"
        />
      </QTd>
    </template>
    <template #body-cell-status="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <QBadge
          :color="props.value === 'active' ? 'green' : 'grey'"
        >
          {{ props.value }}
        </QBadge>
      </QTd>
    </template>
  </QTable>
</template>
<script setup>
import { Dialog, QBadge, QBtn, QIcon, QTable, QTd, QToggle } from 'quasar'
import { computed, ref } from 'vue'

import { useCurrentGroupId } from '@/group/helpers'
import { usePlaceStatuses, usePlaceStatusHelpers } from '@/places/helpers'

import EditPlaceStatusDialog from '@/group/components/EditPlaceStatusDialog.vue'

const { getTranslatedName, getColorName } = usePlaceStatusHelpers()

const groupId = useCurrentGroupId()

const placeStatuses = usePlaceStatuses(groupId)
const filteredPlaceStatus = computed(() => {
  if (showArchived.value) {
    return placeStatuses.value
  }
  else {
    return placeStatuses.value.filter(placeStatus => !placeStatus.isArchived)
  }
})

const showArchived = ref(false)

const columns = computed(() => [
  {
    name: 'colour',
    field: row => getColorName(row),
    align: 'right',
    autoWidth: true,
  },
  {
    name: 'name',
    label: 'Name',
    field: row => getTranslatedName(row),
    align: 'left',
    classes: 'text-weight-bold',
  },
  showArchived.value && {
    name: 'status',
    label: 'Status',
    field: row => row.isArchived ? 'archived' : 'active',
    align: 'left',
  },
].filter(Boolean))

function createNewPlaceStatus () {
  Dialog.create({
    component: EditPlaceStatusDialog,
    componentProps: {
      placeStatus: {
        name: undefined,
        colour: undefined,
      },
    },
  })
}

function edit (event, placeStatus) {
  Dialog.create({
    component: EditPlaceStatusDialog,
    componentProps: {
      placeStatus,
    },
  })
}

</script>
