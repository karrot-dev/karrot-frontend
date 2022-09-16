<template>
  <div>
    <div
      class="row no-wrap items-center justify-between bg-white q-px-sm q-py-xs"
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
        <template #option="scope">
          <QItem
            :key="scope.index"
            dense
            v-bind="scope.itemProps"
          >
            <QItemSection avatar>
              <QIcon
                :name="scope.opt.icon"
                :color="scope.opt.color"
                size="1.1em"
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
              :color="scope.opt.color"
              size="1.1em"
              class="on-left q-ml-xs"
            />
            <div class="ellipsis">
              {{ scope.opt.label }}
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
        v-model="onlyFavorites"
        :label="$t('PLACE_LIST.ONLY_FAVORITES')"
      />
    </div>
    <div class="row">
      <div
        v-if="isEditor && status === 'active'"
        class="col-md-4 col-6"
      >
        <QCard style="height: 240px">
          <RouterLink
            class="absolute-center fit"
            :to="{ name: 'placeCreate', params: { groupId } }"
            :title="$t('BUTTON.CREATE')"
          >
            <QIcon
              size="5em"
              class="fit"
              name="fas fa-plus"
              color="secondary"
            />
          </RouterLink>
        </QCard>
      </div>
      <div
        v-for="place in filteredPlaces"
        :key="place.id"
        class="col-md-4 col-6"
      >
        <QCard
          style="height: 240px"
        >
          <QItem
            :to="{ name: placeRoute(place), params: { placeId: place.id } }"
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

          <div
            class="row no-wrap q-gutter-xs q-ml-sm q-mr-sm"
            style="height: 32px"
          >
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
              v-if="activityCountFor(place.id) > 0"
              :to="{ name: 'placeActivities', params: { placeId: place.id }}"
              :title="$tc('PLACE_LIST.UPCOMING_ACTIVITIES', activityCountFor(place.id), { count: activityCountFor(place.id) })"
            >
              <QChip
                square
                size="sm"
                color="secondary"
                text-color="white"
                icon="fas fa-asterisk"
              >
                <strong class="q-ml-sm">
                  {{ activityCountFor(place.id) }}
                </strong>
              </QChip>
            </RouterLink>
            <QIcon
              v-if="place.isSubscribed"
              class="q-ml-sm self-center"
              name="fas fa-star"
              color="secondary"
              :title="$t('PLACE_LIST.SUBSCRIBED')"
            />
          </div>

          <div class="q-ml-md q-mr-xs q-mt-xs limit-height text-grey-9">
            <Markdown
              v-if="place.description"
              :source="place.description"
            />
          </div>
        </QCard>
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
          {{ $t('ACTIVITYLIST.NONE_DUE_TO_FILTER') }}
        </h5>
        <template #action>
          <QBtn
            flat
            @click="() => clearFilters()"
          >
            {{ $t('GLOBAL.CLEAR_FILTERS') }}
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
  debounce,
} from 'quasar'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActivityListQuery } from '@/activities/queries'
import { useCurrentGroupService } from '@/group/services'
import { statusList } from '@/places/placeStatus'
import { placeRoute } from '@/places/utils'
import { useStatusService } from '@/status/services'
import { useQueryParams } from '@/utils/mixins/bindRoute'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'

import Markdown from '@/utils/components/Markdown.vue'

import { usePlaceHelpers, usePlaceTypeHelpers } from '../helpers'
import { usePlaceTypeService } from '../services'

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

const {
  getPlaceTypesByGroup,
  getPlaceTypeById,
} = usePlaceTypeService()

const {
  activities,
  isFetching: isFetchingActivities,
  hasNextPage,
  fetchNextPage,
} = useActivityListQuery({
  groupId,
  dateMin: newDateRoundedTo5Minutes(),
  pageSize: 1200,
}, {
  cacheTime: 5 * 60 * 1000,
  staleTime: Infinity, // no need for staleness, gets reloaded after 5 min anyway due to dateMin changing,
})

watch(isFetchingActivities, value => {
  // load ALL activities
  if (!value && hasNextPage.value) {
    fetchNextPage()
  }
})

const activityCountByPlace = computed(() => activities.value.reduce((acc, entry) => {
  if (acc[entry.place]) {
    acc[entry.place] += 1
  }
  else {
    acc[entry.place] = 1
  }
  return acc
}, {}))

function activityCountFor (placeId) {
  return activityCountByPlace.value[placeId]
}

const placeTypes = computed(() => getPlaceTypesByGroup(groupId).sort(sortByTranslatedName))

const { t } = useI18n()

const defaultQueryParams = {
  type: null,
  status: 'active',
  onlyFavorites: false,
  search: '',
}

const {
  type,
  status,
  onlyFavorites,
  search,
} = useQueryParams(defaultQueryParams)

function clearFilters () {
  type.value = null
  status.value = 'active'
  onlyFavorites.value = false
  search.value = ''
}

function getUnreadWallMessageCount (place) {
  return getPlaceStatus(place.id)?.unreadWallMessageCount
}

const typeOptions = computed(() => ([
  {
    label: t('ACTIVITYLIST.FILTER.ALL_TYPES'),
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

const statusOptions = computed(() => {
  return statusList
    .map(s => ({
      value: s.key,
      label: t(s.label),
      color: s.color,
      icon: 'fas fa-circle',
    }))
})

const filteredPlaces = computed(() => places.value.filter(place => (
  (!type.value || place.placeType === parseInt(type.value)) &&
  (place.status === status.value) &&
  (!onlyFavorites.value || place.isSubscribed) &&
  (!search || place.name.toLowerCase().includes(search.value.toLowerCase()))
)))

const hasNoPlacesDueToFilters = computed(() => {
  return type && filteredPlaces.value.length === 0
})

const debouncedSearch = debounce(value => { search.value = value }, 500)
</script>

<style lang="sass">
.limit-height
  position: relative
  max-height: 140px
  overflow-y: hidden
</style>
