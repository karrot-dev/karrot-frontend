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
            <QItemSection side>
              <QIcon
                v-if="opt.activityType"
                v-bind="getIconProps(opt.activityType)"
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
        <template #after-options>
          <QSeparator />
          <QItem
            clickable
            :to="{ name: 'groupEditActivityTypes' }"
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
                Manage types
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
      <ActivityCreateButton v-if="isEditor" />
      <ICSBtn
        :group="groupId"
        :joined="true"
        color="secondary"
        padding="4px 13px"
        rounded
        size="sm"
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
      />
      <KSpinner v-show="isLoading || isFetchingNextPage" />
    </QInfiniteScroll>
    <template v-if="hasNoActivities">
      <KNotice>
        <template #icon>
          <QIcon class="fas fa-bed" />
        </template>
        {{ $t('ACTIVITYLIST.NONE') }}
        <template
          v-if="isEditor"
          #desc
        >
          {{ $t('ACTIVITYLIST.NONE_HINT') }}
        </template>
      </KNotice>
    </template>
    <div
      v-if="hasNoActivitiesDueToFilters"
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

<script>
import {
  QBtn,
  QIcon,
  QItem,
  QItemSection,
  QItemLabel,
  QInfiniteScroll,
  QSelect,
  QBanner,
  QSpace, QSeparator,
} from 'quasar'
import { computed } from 'vue'

import { useActivityHelpers, useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityListQuery } from '@/activities/queries'
import { useActivityTypeService } from '@/activities/services'
import { useCurrentGroupService } from '@/group/services'
import { usePlaceService } from '@/places/services'
import { useQueryParams } from '@/utils/mixins/bindRoute'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'

import ActivityCreateButton from '@/activities/components/ActivityCreateButton.vue'
import ActivityList from '@/activities/components/ActivityList.vue'
import ICSBtn from '@/activities/components/ICSBtn.vue'
import KNotice from '@/utils/components/KNotice.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

export default {
  components: {
    QSeparator,
    QBtn,
    ICSBtn,
    QIcon,
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
    ActivityCreateButton,
  },
  setup () {
    const {
      groupId,
      isEditor,
    } = useCurrentGroupService()
    const { getActivityTypesByGroup } = useActivityTypeService()
    const { getPlacesByGroup } = usePlaceService()
    const { getIsStartedOrUpcoming } = useActivityHelpers()
    const {
      getIconProps,
      getTranslatedName,
    } = useActivityTypeHelpers()

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
    const placesFilter = computed(() => place.value === 'subscribed' ? 'subscribed' : null)

    function toInt (ref) {
      return computed(() => ref.value && parseInt(ref.value))
    }

    const {
      isLoading,
      isFetching,
      isFetchingNextPage,
      activities: activitiesRaw,
      hasNextPage,
      fetchNextPage,
    } = useActivityListQuery({
      groupId,
      slots,
      // not strictly needed, but nice to keep id params as ints
      // as these come from URL query they are strings otherwise
      activityTypeId: toInt(type),
      placeId: toInt(placeIdFilter),
      placeArchived: false,
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

    const activities = computed(() => activitiesRaw.value.filter(getIsStartedOrUpcoming))
    // TODO: allow filtering for activities where the type is archived?
    // before we would include archived activity types if we had some activities for that type
    // maybe we can just have an option somewhere to include archived types?
    const activityTypes = computed(() => getActivityTypesByGroup(groupId).filter(activityType => !activityType.isArchived))
    const places = computed(() => getPlacesByGroup(groupId).filter(place => !place.isArchived).sort(sortByFavouritesThenName))

    return {
      isEditor,
      getIconProps,
      getTranslatedName,
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
      activities,
      activityTypes,
      places,
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
            label: this.getTranslatedName(activityType),
            caption: activityType.description,
            // convert to a String as it's also reflected in URL query which is always string
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
