<template>
  <QCard>
    <QImg
      :src="bannerImageURL"
      style="border-bottom: 1px solid #eee;"
    />
    <QCardSection>
      <div class="row">
        <div class="col-12 col-sm-8">
          <Markdown :source="activity.description" />
        </div>
        <div class="col-12 col-sm-4">
          <div
            class="q-mb-sm"
          >
            <QImg
              :src="groupImageURL"
              width="100px"
            />
          </div>
          <div class="text-h6 q-mt-sm q-mb-sm">
            <QIcon v-bind="getIconProps(activityType)" />
            What
          </div>
          <span :class="'text-' + getColorName(activityType)">
            {{ getTranslatedName(activityType) }}
          </span>
          by <RouterLink :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }">
            {{ group.name }}
          </RouterLink>
          <div class="text-h6 q-mt-sm q-mb-sm">
            <QIcon
              name="fas fa-clock"
              color="grey"
            />
            When
          </div>
          {{ $d(activity.date, 'dateLongWithDayName') }}<br>

          {{ $d(activity.date, 'hourMinute') }}
          <template v-if="activity.hasDuration">
            &mdash; {{ $d(activity.dateEnd, 'hourMinute') }}
          </template>
          <div class="text-h6 q-mt-sm q-mb-sm">
            <QIcon
              name="fas fa-map-marker"
              color="grey"
            />
            Where
          </div>
          {{ place.name }}<br>
          {{ place.address }}
        </div>
      </div>
    </QCardSection>
    <QCardSection>
      <div style="height: 300px;">
        <StandardMap :markers="markers" />
      </div>
    </QCardSection>
  </QCard>
</template>

<script setup>
import {
  QCard,
  QCardSection,
  QImg,
  QIcon,
} from 'quasar'
import { computed } from 'vue'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityItemQuery } from '@/activities/queries'
import { useActivityTypeService } from '@/activities/services'
import { useGroupInfoService } from '@/groupInfo/services'
import { usePlaceService } from '@/places/services'
import { useIntegerRouteParam } from '@/utils/composables'

import StandardMap from '@/maps/components/StandardMap'
import { placeMarker } from '@/maps/components/markers'
import Markdown from '@/utils/components/Markdown'

const activityId = useIntegerRouteParam('activityId')

// TODO: these values will probably get returned by the public activity API ...
const { getPlaceById } = usePlaceService()
const { getGroupById } = useGroupInfoService()
const { getActivityTypeById } = useActivityTypeService()

const { getIconProps, getColorName, getTranslatedName } = useActivityTypeHelpers()

const { activity } = useActivityItemQuery({ activityId })

const activityType = computed(() => activity.value ? getActivityTypeById(activity.value.activityType) : null)
const place = computed(() => activity.value ? getPlaceById(activity.value.place) : null)
const group = computed(() => place.value ? getGroupById(place.value.group) : null)

const bannerImageURL = computed(() => activity.value?.bannerImageUrls?.fullSize)
const groupImageURL = computed(() => group.value?.photoUrls?.[200])

const markers = computed(() => [placeMarker(place.value)])
</script>
