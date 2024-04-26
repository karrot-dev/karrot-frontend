<template>
  <div>
    <div
      class="row items-center bg-white q-pa-sm rounded-borders gap-sm"
    >
      <QSelect
        v-model="type"
        :options="typeOptions"
        emit-value
        map-options
        filled
        hide-bottom-space
        dense
      >
        <template #option="{ index, opt, itemProps }">
          <template v-if="opt.value === '$manage'">
            <QSeparator />
            <QItem
              :key="index"
              clickable
              :to="{ name: 'groupEditPlaceTypes' }"
            >
              <QItemSection side>
                <QIcon
                  name="fa fa-cog"
                  color="gray"
                  size="1.1em"
                />
              </QItemSection>
              <QItemSection>
                <QItemLabel class="text-italic">
                  {{ $t('LABELS.MANAGE_TYPES') }}
                </QItemLabel>
              </QItemSection>
            </QItem>
          </template>
          <QItem
            v-else
            :key="index"
            dense
            v-bind="itemProps"
          >
            <QItemSection side>
              <QIcon
                v-if="opt.placeType"
                v-bind="getIconProps(opt.placeType)"
                color="positive"
                size="1.1em"
              />
              <QIcon
                v-else
                color="transparent"
                size="1.1em"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel>
                {{ opt.label }}
              </QItemLabel>
              <QItemLabel
                v-if="opt.caption"
                caption
                class="ellipsis"
                style="max-width: 200px;"
                :title="opt.caption"
              >
                {{ opt.caption }}
              </QItemLabel>
            </QItemSection>
          </QItem>
          <QSeparator v-if="!opt.value" />
        </template>
      </QSelect>
      <QSelect
        v-model="status"
        :options="statusOptions"
        map-options
        emit-value
        filled
        hide-bottom-space
        dense
      >
        <template #option="{ index, opt, itemProps }">
          <QSeparator v-if="opt.value === '$seperator'" />
          <template v-else-if="opt.value === '$manage'">
            <QSeparator />
            <QItem
              clickable
              :to="{ name: 'groupEditPlaceStatuses' }"
            >
              <QItemSection side>
                <QIcon
                  name="fa fa-cog"
                  color="gray"
                  size="1.1em"
                />
              </QItemSection>
              <QItemSection>
                <QItemLabel class="text-italic">
                  {{ $t('LABELS.MANAGE_STATUSES') }}
                </QItemLabel>
              </QItemSection>
            </QItem>
          </template>
          <QItem
            v-else
            :key="index"
            dense
            v-bind="itemProps"
          >
            <QItemSection side>
              <QIcon
                v-if="opt.color"
                name="fas fa-circle"
                :color="opt.color"
                size="1.1em"
              />
              <QIcon
                v-else
                color="transparent"
                size="1.1em"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel>{{ opt.label }}</QItemLabel>
              <QItemLabel
                v-if="opt.caption"
                caption
                class="ellipsis"
                style="max-width: 200px;"
                :title="opt.caption"
              >
                {{ opt.caption }}
              </QItemLabel>
            </QItemSection>
          </QItem>
        </template>
        <template #selected-item="{ opt }">
          <div class="row no-wrap ellipsis">
            <QIcon
              v-if="opt.color"
              name="fas fa-circle"
              :color="opt.color"
              size="1.1em"
              class="on-left q-ml-xs"
            />
            <div class="ellipsis">
              {{ opt.label }}
            </div>
          </div>
        </template>
      </QSelect>
      <QInput
        :model-value="search"
        :label="$t('BUTTON.SEARCH')"
        filled
        hide-bottom-space
        dense
        @update:model-value="debouncedSearch"
        @keyup.enter="event => search = event.target.value"
      />
      <QCheckbox
        v-model="onlyFavourites"
        :label="$t('PLACE_LIST.ONLY_FAVOURITES')"
      />
      <QSpace />
      <QBtn
        v-if="isEditor"
        color="secondary"
        icon="fas fa-plus"
        padding="4px 13px"
        rounded
        size="sm"
        unelevated
        :title="$t('CREATESTORE.TITLE')"
        :to="{ name: 'placeCreate', params: { groupId } }"
      />
    </div>
    <div class="row">
      <div
        v-for="place in filteredPlaces"
        :key="place.id"
        class="col-md-4 col-6"
      >
        <PlaceCard
          :place="place"
          :activity-count="activityCountByPlace[place.id]"
        />
      </div>
    </div>

    <div
      v-if="hasNoPlacesDueToFilters"
      class="q-pa-md"
    >
      <QBanner
        class="bg-white"
        :inline-actions="$q.platform.is.desktop"
      >
        <template #avatar>
          <QIcon
            name="fas fa-info-circle"
            color="grey"
          />
        </template>
        <h5 class="q-ma-xs">
          {{ $t('PLACE_LIST.NONE_DUE_TO_FILTER') }}
        </h5>
        <template #action>
          <QBtn
            flat
            @click="() => showAll()"
          >
            {{ $t('STOREEDIT.SHOW_ALL') }}
          </QBtn>
        </template>
      </QBanner>
    </div>
  </div>
</template>

<script setup>
import {
  QSelect,
  QBtn,
  QIcon,
  QItem,
  QItemSection,
  QItemLabel,
  QBanner,
  QCheckbox,
  QInput,
  QSpace,
  QSeparator,
  debounce,
} from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActivityCountQuery } from '@/activities/queries'
import { useCurrentGroupService } from '@/group/services'
import { useQueryParams } from '@/utils/mixins/bindRoute'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'

import PlaceCard from '@/places/components/PlaceCard.vue'

import { usePlaceStatusHelpers, usePlaceTypeHelpers } from '../helpers'
import { usePlaceStatusService, usePlaceTypeService } from '../services'

const {
  groupId,
  places,
  isEditor,
} = useCurrentGroupService()

const {
  getTranslatedName,
  getIconProps,
  sortByTranslatedName,
} = usePlaceTypeHelpers()

const placeStatusHelpers = usePlaceStatusHelpers()

const {
  getPlaceTypesByGroup,
} = usePlaceTypeService()

const placeTypes = computed(() => getPlaceTypesByGroup(groupId).sort(sortByTranslatedName))

const { t } = useI18n()

const defaultQueryParams = {
  type: null,
  status: null,
  onlyFavourites: false,
  search: '',
}

const {
  type,
  status,
  onlyFavourites,
  search,
} = useQueryParams(defaultQueryParams)

function showAll () {
  type.value = null
  status.value = null
  onlyFavourites.value = false
  search.value = ''
}

const typeOptions = computed(() => [
  {
    label: t('PLACE_LIST.ALL_TYPES'),
    value: null,
  },
  ...placeTypes.value.map(placeType => {
    return {
      label: getTranslatedName(placeType),
      caption: placeType.description,
      // convert to a String as it's also reflected in URL query which is always string
      value: String(placeType.id),
      placeType,
    }
  }),
  isEditor.value && {
    value: '$manage',
  },
].filter(Boolean))

const { getPlaceStatusesByGroup } = usePlaceStatusService()

const placeStatuses = computed(() => getPlaceStatusesByGroup(groupId.value))

const visiblePlaceStatuses = computed(() => placeStatuses.value.filter(placeStatus => !placeStatus.isArchived && placeStatus.isVisible))
const otherPlaceStatuses = computed(() => placeStatuses.value.filter(placeStatus => !placeStatus.isArchived && !placeStatus.isVisible))

function placeStatusToOption (placeStatus) {
  return {
    label: placeStatusHelpers.getTranslatedName(placeStatus),
    caption: placeStatus.description,
    value: String(placeStatus.id),
    color: placeStatusHelpers.getColorName(placeStatus),
    placeStatus,
  }
}

const statusOptions = computed(() => {
  const optionGroups = [
    [
      {
        label: t('PLACE_LIST.VISIBLE_STATUSES'),
        value: null,
      },
      {
        label: t('PLACE_LIST.ALL_STATUSES'),
        value: 'all',
      },
    ],
    visiblePlaceStatuses.value.map(placeStatusToOption),
    otherPlaceStatuses.value.map(placeStatusToOption),
    [
      {
        label: t('LABELS.ARCHIVED'),
        value: 'archived',
        color: 'black',
      },
    ],
  ]
  const options = []
  optionGroups.forEach((entries, idx) => {
    options.push(...entries)
    if (idx < optionGroups.length - 1) {
      options.push({
        value: '$seperator',
      })
    }
  })

  if (isEditor.value) {
    options.push({
      value: '$manage',
    })
  }

  return options
})

const visiblePlaceStatusIds = computed(() => {
  // TODO: right now we are NOT filtering out the archived place statuses...
  // as that does not imply the place itself is archived... have not resolved how to handle this...
  return placeStatuses.value.filter(placeStatus => placeStatus.isVisible).map(placeStatus => placeStatus.id)
})

function filterType (place) {
  return !type.value || place.placeType === parseInt(type.value)
}

function filterFavourites (place) {
  return !onlyFavourites.value || place.isSubscribed
}

function filterSearch (place) {
  return !search || place.name.toLowerCase().includes(search.value.toLowerCase())
}

function filterStatus (place) {
  if (status.value === 'archived') {
    return Boolean(place.archivedAt)
  }
  else if (place.archivedAt) {
    // never show archived places unless explicit
    return false
  }
  else if (status.value === 'all') {
    return true
  }
  else if (status.value) {
    // match status by id
    return place.status === parseInt(status.value)
  }
  // Default, visible places
  return visiblePlaceStatusIds.value.includes(place.status)
}

const filters = [
  filterType,
  filterFavourites,
  filterSearch,
  filterStatus,
]
const filteredPlaces = computed(
  () => places.value.filter(place => filters.every(filter => filter(place))),
)

const hasNoPlacesDueToFilters = computed(() => {
  return type && filteredPlaces.value.length === 0
})

const debouncedSearch = debounce(value => { search.value = value }, 500)

const {
  activityCountByPlace,
} = useActivityCountQuery({
  groupId,
  dateMin: newDateRoundedTo5Minutes(),
})

</script>
