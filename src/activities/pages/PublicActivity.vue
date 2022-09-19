<template>
  <QCard v-if="publicActivity">
    <QImg
      v-if="bannerImageURL"
      :src="bannerImageURL"
      style="border-bottom: 1px solid #eee;"
    >
      <!-- TODO: need to also show this when there isn't a banner -->
      <div class="absolute-bottom text-h5">
        <RouterLink :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }">
          {{ group.name }}
        </RouterLink> //
        <span :style="{ color: '#' + activityType.colour }">
          <QIcon
            v-bind="getIconProps(activityType)"
            size="md"
            class="q-px-sm"
          />
        </span>
        <span :style="{ color: '#' + activityType.colour }">
          {{ getTranslatedName(activityType) }}
        </span>
      </div>
    </QImg>
    <QCardSection>
      <div class="row">
        <div class="col-12 col-sm-8">
          <Markdown
            :source="publicActivity.description"
            class="q-pl-lg q-pr-lg"
          />
        </div>
        <div
          class="col-12 col-sm-4 q-pl-md"
          style="border-left: 1px solid #eee;"
        >
          <div
            v-if="groupImageURL"
            class="q-mb-sm text-center"
          >
            <QImg
              :src="groupImageURL"
              width="100px"
            />
          </div>
          <div>
            <div class="text-h6 q-mt-sm q-mb-sm">
              <QIcon
                v-bind="getIconProps(activityType)"
                color="grey"
                class="q-pr-xs"
              />
              What
            </div>
            <span :style="{ color: '#' + activityType.colour }">
              {{ getTranslatedName(activityType) }}
            </span> by <em><RouterLink :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }">
              {{ group.name }}
            </RouterLink></em>
          </div>
          <div class="text-h6 q-mt-sm q-mb-sm">
            <QIcon
              name="fas fa-clock"
              color="grey"
              class="q-pr-xs"
            />
            When
          </div>
          {{ $d(publicActivity.date, 'dateLongWithDayName') }}<br>

          {{ $d(publicActivity.date, 'hourMinute') }}
          <template v-if="publicActivity.hasDuration">
            &mdash; {{ $d(publicActivity.dateEnd, 'hourMinute') }}
          </template>
          <div class="text-h6 q-mt-sm q-mb-sm">
            <QIcon
              :name="place.placeType.icon || 'fas fa-map-marker'"
              color="grey"
              class="q-pr-xs"
            />
            Where
          </div>
          {{ place.name }}<br>
          {{ place.address }}
        </div>
      </div>
    </QCardSection>
    <QCardSection v-if="mapMarker">
      <div style="height: 300px;">
        <StandardMap
          :markers="[mapMarker]"
          :scroll-wheel-zoom="false"
        />
      </div>
    </QCardSection>
  </QCard>
  <KSpinner v-else />
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
import { useActivePublicActivityService } from '@/activities/services'

import StandardMap from '@/maps/components/StandardMap'
import KSpinner from '@/utils/components/KSpinner'
import Markdown from '@/utils/components/Markdown'

const { getIconProps, getTranslatedName } = useActivityTypeHelpers()

const { publicActivity } = useActivePublicActivityService()

const activityType = computed(() => publicActivity.value?.activityType)
const place = computed(() => publicActivity.value?.place)
const group = computed(() => place.value?.group)

const bannerImageURL = computed(() => publicActivity.value?.bannerImageUrls?.fullSize)
const groupImageURL = computed(() => group.value?.photoUrls?.[200])

const mapMarker = computed(() => {
  if (!place.value) return
  const { latitude, longitude } = place.value
  if (!latitude || !longitude) return
  return {
    latLng: { lat: latitude, lng: longitude },
    fontIcon: place.value.placeType.icon || 'fas fa-map-marker',
    color: 'positive',
  }
})
</script>
