<template>
  <div>
    <div
      class="row no-wrap items-center justify-between bg-white q-px-sm q-py-xs q-gutter-sm"
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
                v-if="opt.activityType"
                v-bind="opt.activityType.iconProps"
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
        v-model="slots"
        :options="slotsOptions"
        emit-value
        map-options
        outlined
        hide-bottom-space
        dense
      />
      <QSelect
        v-if="places.length > 1"
        v-model="place"
        :options="placeOptions"
        emit-value
        map-options
        outlined
        hide-bottom-space
        dense
        use-input
        fill-input
        hide-selected
        @filter="filterPlaceOptions"
      >
        <template #option="{ index, itemProps, opt }">
          <QItem
            :key="index"
            dense
            v-bind="itemProps"
          >
            <QItemSection>
              <QItemLabel>{{ opt.label }}</QItemLabel>
            </QItemSection>
            <QItemSection side>
              <QIcon
                v-if="opt.place?.isSubscribed || opt.value === 'subscribed'"
                name="fas fa-fw fa-star"
                color="green"
                size="1.1em"
              />
            </QItemSection>
          </QItem>
        </template>
      </QSelect>
      <QSpace />
      <ICSBtn
        :group="groupId"
        :joined="true"
      />
    </div>
    <QInfiniteScroll
      :disable="!hasNextPage"
      :offset="100"
      @load="maybeFetchMore"
    >
      <ActivityList
        :activities="activities"
        place-link
        :ics-url="''"
        :token-pending="false"
        @detail="detail"
      />
      <KSpinner v-show="isLoading || isFetchingNextPage" />
    </QInfiniteScroll>
    <template v-if="hasNoActivities">
      <KNotice>
        <template #icon>
          <QIcon class="fas fa-bed" />
        </template>
        {{ $t('ACTIVITYLIST.NONE') }}
        <template #desc>
          {{ $t('ACTIVITYLIST.NONE_HINT') }}
        </template>
      </KNotice>
      <QCard>
        <QCardSection>
          <span v-t="'GROUP.PLACES'" />
        </QCardSection>
        <QCardSection>
          <PlaceList
            :group-id="groupId"
            :places="places"
            link-to="placeActivitiesManage"
          />
        </QCardSection>
      </QCard>
    </template>
    <div
      v-if="hasNoActivitiesDueToFilters"
      class="q-pa-md"
    >
      <QBanner
        class="bg-white"
        inline-actions
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

<script>
import { computed } from 'vue'
import {
  QCard,
  QIcon,
  QCardSection,
  QItem,
  QItemSection,
  QItemLabel,
  QInfiniteScroll,
  QSelect,
  QBanner,
  QSpace,
} from 'quasar'

import { mapActions } from 'vuex'

import KSpinner from '@/utils/components/KSpinner'
import ActivityList from '@/activities/components/ActivityList'
import KNotice from '@/utils/components/KNotice'
import PlaceList from '@/places/components/PlaceList'
import { useActivityListQuery } from '@/activities/queries'
import { useActivityEnricher, useActivityTypeEnricher } from '@/activities/enrichers'
import { useActivityTypeService } from '@/activities/services'
import { useCurrentGroupService } from '@/group/services'
import { usePlaceEnricher } from '@/places/enrichers'
import { usePlaceService } from '@/places/services'
import { useQueryParams } from '@/utils/mixins/bindRoute'
import ICSBtn from '@/activities/components/ICSBtn'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'

export default {
  components: {
    ICSBtn,
    QCard,
    QIcon,
    QCardSection,
    QInfiniteScroll,
    QSelect,
    QBanner,
    QItem,
    QItemSection,
    QItemLabel,
    QSpace,
    ActivityList,
    KNotice,
    KSpinner,
    PlaceList,
  },
  setup () {
    const { groupId } = useCurrentGroupService()
    const { getActivityTypesByGroup, isStartedOrUpcoming } = useActivityTypeService()
    const { getPlacesByGroup } = usePlaceService()
    const enrichActivity = useActivityEnricher()
    const enrichActivityType = useActivityTypeEnricher()
    const enrichPlace = usePlaceEnricher()

    const defaultQueryParams = {
      type: null,
      slots: null,
      place: null,
    }

    const {
      type,
      slots,
      place,
    } = useQueryParams(defaultQueryParams)

    function clearFilters () {
      type.value = null
      slots.value = null
      place.value = null
    }

    // "place" can be a place id, or the string "subscribed", but for the query they need to be separate params
    const placeIdFilter = computed(() => place.value !== 'subscribed' ? place.value : null)
    const placesFilter = computed(() => place.value === 'subscribed' ? place.value : null)

    const {
      isLoading,
      isFetching,
      isFetchingNextPage,
      activities,
      hasNextPage,
      fetchNextPage,
    } = useActivityListQuery({
      groupId,
      slots,
      activityTypeId: type,
      placeId: placeIdFilter,
      places: placesFilter,
      // so we can use cached query results for a while, otherwise it'll always be a fresh query
      dateMin: newDateRoundedTo5Minutes(),
    }, {
      keepPreviousData: true, // means it doesn't flicker when changing filter params
    })

    async function maybeFetchMore (index, done) {
      if (!isFetching.value && hasNextPage.value) await fetchNextPage()
      done(!hasNextPage.value)
    }

    function sortByFavouritesThenName (a, b) {
      if (a.isSubscribed === b.isSubscribed) {
        return a.name.localeCompare(b.name)
      }
      return a.isSubscribed ? -1 : 1
    }

    const enrichedUpcomingActivities = computed(() => activities.value.filter(isStartedOrUpcoming).map(enrichActivity))
    const enrichedActivityTypes = computed(() => getActivityTypesByGroup(groupId, { status: 'active' }).map(enrichActivityType))
    const enrichedPlaces = computed(() => getPlacesByGroup(groupId, { status: 'active' }).sort(sortByFavouritesThenName).map(enrichPlace))

    return {
      placesFilter,
      groupId,
      slots,
      type,
      place,
      maybeFetchMore,
      clearFilters,
      hasNextPage,
      isLoading,
      isFetching,
      isFetchingNextPage,
      activities: enrichedUpcomingActivities,
      // TODO: how to do that filtering to hide archived types unless we have results for them? (we can't tell if we have results for them now we don't fetch them all)
      activityTypes: enrichedActivityTypes,
      places: enrichedPlaces,
    }
  },
  data () {
    return {
      placeOptionsFilter: null,
    }
  },
  computed: {
    hasNoActivities () {
      return !this.isFetching && !this.type && !this.slots && this.activities.length === 0
    },
    hasNoActivitiesDueToFilters () {
      return !this.isFetching && (this.type || this.slots) && this.activities.length === 0
    },
    hasMultipleFavouritePlaces () {
      return this.places.filter(place => place.isSubscribed).length > 1
    },
    slotsOptions () {
      return [
        {
          label: this.$t('ACTIVITYLIST.FILTER.ALL'),
          value: null,
        },
        {
          label: this.$t('ACTIVITYLIST.FILTER.FREE'),
          value: 'free',
        },
        {
          label: this.$t('ACTIVITYLIST.FILTER.EMPTY'),
          value: 'empty',
        },
        {
          label: this.$t('ACTIVITYLIST.FILTER.JOINED'),
          value: 'joined',
        },
      ]
    },
    typeOptions () {
      return [
        {
          label: this.$t('ACTIVITYLIST.FILTER.ALL_TYPES'),
          value: null,
        },
        ...this.activityTypes.map(activityType => {
          return {
            label: activityType.translatedName,
            value: String(activityType.id),
            activityType,
          }
        }),
      ]
    },
    placeOptions () {
      return [
        {
          label: this.$t('ACTIVITYLIST.FILTER.ALL_PLACES'),
          value: null,
        },
        // "All favourite places" option is only useful if we have more than 1 (or have the option selected)
        (this.hasMultipleFavouritePlaces || this.place === 'subscribed') && {
          label: this.$t('ACTIVITYLIST.FILTER.ALL_FAVOURITE_PLACES'),
          value: 'subscribed',
        },
        ...this.places.map(place => {
          return {
            label: place.name,
            value: String(place.id),
            place,
          }
        }),
      ].filter(option => {
        if (!option) return false
        return !this.placeOptionsFilter || option.label.toLowerCase().includes(this.placeOptionsFilter)
      })
    },
  },
  watch: {
    slots (val, old) {
      // keep selection valid, revert to old value or default
      const options = this.slotsOptions.map(o => o.value)
      if (!options.includes(val)) {
        if (options.includes(old)) {
          this.slots = old
        }
        else {
          this.slots = options[0]
        }
      }
    },
  },
  methods: {
    ...mapActions({
      detail: 'detail/openForActivity',
    }),
    filterPlaceOptions (val, update) {
      this.placeOptionsFilter = val
      update()
    },
  },
}
</script>

<style scoped lang="sass">
.padding
  padding: 1em

.notice
  .icon
    margin: .1em 0 0 0
  padding: 2em 3em
  transform: translateZ(1px) rotate(-3deg)

  h5
    padding: 0

.manage
  padding: 8px

  q-btn
    display: inline-block
    padding: .3em
</style>
