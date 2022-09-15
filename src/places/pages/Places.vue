<template>
  <div>
    <div class="bg-white q-px-sm q-py-lg row justify-between">
      <span class="text-h4">
        Discover Places...
      </span>
      <QBtn
        v-if="isEditor"
        round
        color="secondary"
        :to="{ name: 'placeCreate', params: { groupId } }"
        :title="$t('BUTTON.CREATE')"
      >
        <QIcon name="fas fa-fw fa-plus" />
      </QBtn>
    </div>
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
            <QItemSection side>
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
        v-model="search"
        :label="$t('BUTTON.SEARCH')"
        outlined
        hide-bottom-space
        dense
      />
      <QCheckbox
        v-model="onlyFavorites"
        :label="$t('PLACE_LIST.ONLY_FAVORITES')"
      />
    </div>
    <div class="row">
      <div
        v-for="place in filteredPlaces"
        :key="place.id"
        class="col-md-4 col-6"
      >
        <RouterLink :to="{ name: 'place', params: { placeId: place.id } }">
          <QCard
            style="height: 200px"
            class="relative-position"
          >
            <RandomArt
              :seed="place.id"
              type="banner"
              style="height: 42px"
            />
            <div
              class="q-pl-md q-pa-sm text-h5 ellipsis absolute-top text-white"
              style="background-color: rgba(0, 0, 0, 0.35); height: 42px"
              :title="place.name"
            >
              {{ place.name }}
            </div>
            <div class="q-ml-md limit-height">
              <Markdown
                v-if="place.description"
                :source="place.description"
              />
            </div>
            <QCardActions>
              <QBadge
                v-if="getUnreadWallMessageCount(place)"
                color="secondary"
              >
                {{ getUnreadWallMessageCount(place) > 99 ? '99+' : getUnreadWallMessageCount(place) }} unread messages
              </QBadge>
              <QBadge
                color="yellow-10"
              >
                {{ activityCountFor(place.id) }} upcoming activities
              </QBadge>
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
  QCardActions,
  QBadge,
  QItem,
  QItemSection,
  QItemLabel,
  QBanner,
  QCheckbox,
  QInput,
} from 'quasar'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActivityListQuery } from '@/activities/queries'
import { useCurrentGroupService } from '@/group/services'
import { statusList } from '@/places/placeStatus'
import { useStatusService } from '@/status/services'
import { useQueryParams } from '@/utils/mixins/bindRoute'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'

import Markdown from '@/utils/components/Markdown.vue'
import RandomArt from '@/utils/components/RandomArt'

import { usePlaceTypeHelpers } from '../helpers'
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
  getTranslatedName,
  getIconProps,
  sortByTranslatedName,
} = usePlaceTypeHelpers()

const {
  getPlaceTypesByGroup,
} = usePlaceTypeService()

const {
  activities,
  isFetching: isFetchingActivities,
  hasNextPage,
  fetchNextPage,
} = useActivityListQuery({
  groupId,
  dateMin: newDateRoundedTo5Minutes(),
  pageSize: 100,
}, {
  cacheTime: 5 * 60 * 1000,
  staleTime: Infinity, // no need for staleness, gets reloaded after 5 min anyway due to dateMin changing,
})

watch(isFetchingActivities, value => {
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

const filteredPlaces = computed(() => places.value
  .filter(place => !type.value || place.placeType === parseInt(type.value))
  .filter(place => place.status === status.value)
  .filter(place => !onlyFavorites.value || place.isSubscribed)
  .filter(place => !search || place.name.toLowerCase().includes(search.value.toLowerCase())))

const hasNoPlacesDueToFilters = computed(() => {
  return type && filteredPlaces.value.length === 0
})
</script>

<style lang="sass">
.limit-height
  position: relative
  max-height: 67px
  overflow-y: hidden
</style>
