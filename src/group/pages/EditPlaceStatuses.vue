<template>
  <QTable
    ref="tableRef"
    flat
    :columns="columns"
    :rows="placeStatuses"
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
    <template #body-cell-handle="props">
      <QTd
        :props="props"
        :auto-width="true"
        :data-row="JSON.stringify({ id: props.row.id })"
      >
        <QIcon name="fa fa-bars" />
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
    <template #body-cell-visible="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <QIcon
          v-if="props.value"
          name="fas fa-check"
          color="positive"
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
import { generateKeyBetween } from 'fractional-indexing'
import { sortBy } from 'lodash'
import { Dialog, QBadge, QBtn, QIcon, QTable, QTd, QToggle } from 'quasar'
import Sortable from 'sortablejs'
import { computed, ref, watch } from 'vue'

import { useCurrentGroupId } from '@/group/helpers'
import { usePlaceStatuses, usePlaceStatusHelpers } from '@/places/helpers'
import { useSavePlaceStatusMutation } from '@/places/mutations'

import EditPlaceStatusDialog from '@/group/components/EditPlaceStatusDialog.vue'

const tableRef = ref(null)

const { mutateAsync: save } = useSavePlaceStatusMutation()

watch(() => tableRef.value?.$el.querySelector('tbody'), tbody => {
  Sortable.create(tbody, {
    animation: 150,
    ghostClass: 'invisible',
    handle: '.drag-handle',
    async onEnd (event) {
      const { oldIndex, newIndex } = event
      // It is thinking we'll remove it first
      // So if moving higher we need to counter this by adding 1
      const maybeOneMore = newIndex > oldIndex ? 1 : 0
      const prevIndex = newIndex - 1 + maybeOneMore
      const nextIndex = newIndex + maybeOneMore
      const placeStatus = placeStatuses.value[oldIndex]
      const prev = placeStatuses.value[prevIndex]
      const next = placeStatuses.value[nextIndex]
      const prevOrder = prev?.order || null
      let nextOrder = next?.order || null
      if (prevOrder && nextOrder && prevOrder === nextOrder) {
        // generateKeyBetween will throw an error if they are the same...
        nextOrder = null
      }
      const order = generateKeyBetween(prevOrder, nextOrder)
      await save({ id: placeStatus.id, order })
    },
  })
})

const { getTranslatedName, getColorName } = usePlaceStatusHelpers()

const groupId = useCurrentGroupId()

const allPlaceStatuses = usePlaceStatuses(groupId)

const placeStatuses = computed(() => {
  return sortBy(allPlaceStatuses.value.filter(placeStatus => showArchived.value || !placeStatus.isArchived), ['order', 'id'])
})

const showArchived = ref(false)

const columns = computed(() => [
  {
    name: 'handle',
    classes: 'drag-handle',
    style: 'cursor: grab !important',
  },
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
    autoWidth: true,
  },
  {
    name: 'description',
    label: 'Description',
    field: row => row.description,
    align: 'left',
    style: 'max-width: 200px',
    classes: 'ellipsis',
  },
  {
    name: 'visible',
    label: 'Visible',
    field: row => row.isVisible,
    align: 'center',
  },
  showArchived.value && {
    name: 'status',
    label: 'Status',
    field: row => row.isArchived ? 'archived' : 'active',
    align: 'left',
  },
].filter(Boolean))

function generateNextOrder () {
  return generateKeyBetween(placeStatuses.value[placeStatuses.value.length - 1]?.order || null, null)
}

function createNewPlaceStatus () {
  Dialog.create({
    component: EditPlaceStatusDialog,
    componentProps: {
      placeStatus: {
        name: undefined,
        colour: undefined,
        description: undefined,
        order: generateNextOrder(),
        isVisible: true,
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
