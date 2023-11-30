<template>
  <div>
    <div
      class="row items-center bg-white q-px-sm q-py-xs q-gutter-sm"
    >
      <QSelect
        v-model="type"
        :options="typeOptions"
        emit-value
        map-options
        outlined
        hide-bottom-space
        dense
      >
        <template #option="{ index, opt, itemProps }">
          <QItem
            :key="index"
            v-bind="itemProps"
          >
            <QItemSection avatar>
              <QIcon
                v-if="opt.placeType"
                v-bind="getIconProps(opt.placeType)"
                color="positive"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel>
                {{ opt.label }}
              </QItemLabel>
            </QItemSection>
          </QItem>
        </template>
      </QSelect>
      <QSelect
        v-model="status"
        :options="statusOptions"
        map-options
        emit-value
        outlined
        hide-bottom-space
        dense
      >
        <template #option="{ index, opt, itemProps }">
          <QSeparator v-if="opt.value === '$seperator'" />
          <QItem
            v-else
            :key="index"
            dense
            v-bind="itemProps"
          >
            <QItemSection
              avatar
            >
              <QIcon
                v-if="opt.color"
                name="fas fa-circle"
                :color="opt.color"
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
        outlined
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
        <RouterLink :to="{ name: placeRoute(place), params: { placeId: place.id } }">
          <QCard>
            <QItem
              class="bg-grey-3"
            >
              <QItemSection side>
                <QIcon
                  v-bind="getPlaceIconProps(place)"
                />
              </QItemSection>
              <QItemSection>
                <QItemLabel
                  class="ellipsis"
                >
                  {{ place.name }}
                </QItemLabel>
                <QItemLabel
                  caption
                  class="ellipsis"
                >
                  {{ getTranslatedName(getPlaceTypeById(place.placeType)) }}
                </QItemLabel>
              </QItemSection>
            </QItem>

            <div class="q-ml-md q-mr-xs q-mt-xs limit-height text-grey-9">
              <Markdown
                v-if="place.description"
                :source="place.description"
              />
              <div v-else>
                <span class="text-italic">
                  {{ $t("STOREDETAIL.NO_DESCRIPTION") }}
                </span>
              </div>
            </div>

            <QSeparator />
            <QCardActions
              style="height: 42px"
              class="row no-wrap"
            >
              <QChip
                text-color="white"
                square
                size="sm"
                :color="placeStatusHelpers.getColorName(getPlaceStatusById(place.status))"
                :title="getPlaceStatusById(place.status).description"
              >
                {{ placeStatusHelpers.getTranslatedName(getPlaceStatusById(place.status)) }}
              </QChip>
              <RouterLink
                v-if="getUnreadWallMessageCount(place) > 0"
                :to="{ name: 'placeWall', params: { placeId: place.id }}"
              >
                <QChip
                  square
                  size="sm"
                  color="secondary"
                  text-color="white"
                  icon="fas fa-comments"
                  :title="$tc('CONVERSATION.UNREAD_MESSAGES', getUnreadWallMessageCount(place), { count: getUnreadWallMessageCount(place) })"
                >
                  <strong class="q-ml-sm">
                    {{ getUnreadWallMessageCount(place) > 99 ? '99+' : getUnreadWallMessageCount(place) }}
                  </strong>
                </QChip>
              </RouterLink>
              <RouterLink
                :to="{ name: 'placeActivities', params: { placeId: place.id }}"
                :title="$tc('PLACE_LIST.UPCOMING_ACTIVITIES', activityCountFor(place.id), { count: activityCountFor(place.id) })"
              >
                <QChip
                  square
                  size="sm"
                  :color="activityCountFor(place.id) > 0 ? 'secondary' : 'grey'"
                  text-color="white"
                  icon="fas fa-asterisk"
                >
                  <strong class="q-ml-sm">
                    {{ activityCountFor(place.id) || 0 }}
                  </strong>
                </QChip>
              </RouterLink>
              <QSpace />
              <QBtn
                class="q-ml-sm self-center"
                size="sm"
                rounded
                unelevated
                icon="fas fa-star"
                color="white"
                :text-color="place.isSubscribed ? 'secondary' : 'grey'"
                :title="place.isSubscribed ? $t('PLACE_LIST.SUBSCRIBED') : $t('PLACEWALL.SUBSCRIPTION.HEADER')"
                @click.stop.prevent="place.isSubscribed ? unsubscribe(place.id) : subscribe(place.id)"
              />
            </QCardActions>
          </QCard>
        </RouterLink>
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
  QCard,
  QSelect,
  QBtn,
  QIcon,
  QItem,
  QItemSection,
  QItemLabel,
  QBanner,
  QCheckbox,
  QInput,
  QChip,
  QSpace,
  QCardActions,
  QSeparator,
  debounce,
} from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActivityCountQuery } from '@/activities/queries'
import { useCurrentGroupService } from '@/group/services'
import { usePlaceSubscribeMutation, usePlaceUnsubscribeMutation } from '@/places/mutations'
import { placeRoute } from '@/places/utils'
import { useStatusService } from '@/status/services'
import { useQueryParams } from '@/utils/mixins/bindRoute'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'

import Markdown from '@/utils/components/Markdown.vue'

import { usePlaceHelpers, usePlaceStatusHelpers, usePlaceTypeHelpers } from '../helpers'
import { usePlaceStatusService, usePlaceTypeService } from '../services'

const {
  groupId,
  places,
  isEditor,
} = useCurrentGroupService()

const {
  getPlaceStatus,
} = useStatusService()

const {
  getPlaceIconProps,
} = usePlaceHelpers()

const {
  getTranslatedName,
  getIconProps,
  sortByTranslatedName,
} = usePlaceTypeHelpers()

const placeStatusHelpers = usePlaceStatusHelpers()

const {
  getPlaceTypesByGroup,
  getPlaceTypeById,
} = usePlaceTypeService()

const { mutate: subscribe } = usePlaceSubscribeMutation()
const { mutate: unsubscribe } = usePlaceUnsubscribeMutation()

const {
  activityCountByPlace,
} = useActivityCountQuery({
  groupId,
  dateMin: newDateRoundedTo5Minutes(),
})

function activityCountFor (placeId) {
  return activityCountByPlace.value[placeId]
}

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

function getUnreadWallMessageCount (place) {
  return getPlaceStatus(place.id)?.unreadWallMessageCount
}

const typeOptions = computed(() => ([
  {
    label: t('PLACE_LIST.ALL_TYPES'),
    value: null,
  },
  ...placeTypes.value.map(placeType => {
    return {
      label: getTranslatedName(placeType),
      // convert to a String as it's also reflected in URL query which is always string
      value: String(placeType.id),
      placeType,
    }
  }),
]))

const {
  getPlaceStatusById,
  getPlaceStatusesByGroup,
} = usePlaceStatusService()

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
        label: 'Archived', // TODO: translate,
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
</script>

<style lang="sass">
.limit-height
  position: relative
  min-height: 140px
  max-height: 140px
  overflow-y: hidden
</style>
