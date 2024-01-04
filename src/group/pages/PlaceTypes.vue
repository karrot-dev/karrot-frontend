<template>
  <QTable
    :columns="columns"
    :rows="placeTypes"
    hide-pagination
    :pagination="{ rowsPerPage: 0 }"
    flat
    row-key="id"
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
        @click="create()"
      />
    </template>
    <template #body-cell-icon="props">
      <QTd
        :props="props"
        :auto-width="true"
      >
        <QIcon
          size="sm"
          color="positive"
          v-bind="props.value"
        />
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
import { QBadge, QBtn, QIcon, QTable, QTd, QToggle } from 'quasar'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCurrentGroupService } from '@/group/services'
import { usePlaceTypeHelpers, usePlaceTypes } from '@/places/helpers'
import { useOpenDialog } from '@/utils/forms'

import PlaceTypeForm from '@/group/components/PlaceTypeForm.vue'

const openDialog = useOpenDialog()

const { t } = useI18n()

const showArchived = ref(false)

const { groupId } = useCurrentGroupService()
const { getTranslatedName, getIconProps, sortByTranslatedName } = usePlaceTypeHelpers()

const allPlaceTypes = usePlaceTypes(groupId)

const placeTypes = computed(() => {
  return allPlaceTypes.value.filter(placeType => showArchived.value || !placeType.isArchived).sort(sortByTranslatedName)
})

const columns = computed(() => [
  {
    name: 'icon',
    field: row => getIconProps(row),
    align: 'right',
    autoWidth: true,
  },
  {
    name: 'name',
    label: t('PLACE_TYPES.NAME'),
    field: row => getTranslatedName(row),
    align: 'left',
    classes: 'text-weight-bold',
    autoWidth: true,
  },
  {
    name: 'description',
    label: t('LABELS.DESCRIPTION'),
    field: row => row.description,
    align: 'left',
    style: 'max-width: 200px',
    classes: 'ellipsis',
  },
  showArchived.value && {
    name: 'isArchived',
    label: t('PLACE_TYPES.STATUS'),
    field: row => row.isArchived,
    align: 'left',
    autoWidth: true,
  },
].filter(Boolean))

function create () {
  openDialog(PlaceTypeForm, {
    placeType: {
      name: undefined,
      icon: 'fas fa-map-marker',
      description: undefined,
      isVisible: true,
    },
  })
}

function edit (_, placeType) {
  openDialog(PlaceTypeForm, { placeType })
}
</script>
