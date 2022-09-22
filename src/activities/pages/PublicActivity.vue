<template>
  <QCard v-if="publicActivity">
    <QImg
      v-if="bannerImageURL"
      :src="bannerImageURL"
    >
      <div
        class="full-width text-h5 q-pa-md text-black absolute-bottom"
        style="background: rgba(255, 255, 255, 0.8)"
      >
        <RouterLink :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }">
          {{ group.name }}
        </RouterLink> //
        <QIcon
          v-bind="getIconProps(activityType)"
          size="md"
          class="q-px-sm"
        />
        <span :class="getTextClass(activityType)">
          {{ getTranslatedName(activityType) }}
        </span>
      </div>
    </QImg>
    <QSeparator />
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
            <span>
              {{ getTranslatedName(activityType) }}
            </span> by <RouterLink
              :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }"
              style="text-decoration: underline;"
            >
              {{ group.name }}
            </RouterLink>
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

          <QBtn
            v-if="icsURL"
            :href="icsURL"
            outline
            no-caps
            type="a"
            color="primary"
            class="q-mt-sm"
          >
            <template #default>
              <QIcon
                name="event"
                size="xs"
                class="q-mr-xs"
              />
              <span>{{ $t('ACTIVITYLIST.ICS_DIALOG.TITLE') }}</span>
            </template>
          </QBtn>

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
import { onUnmounted, computed, watch } from '@vue/compat'
import {
  QCard,
  QCardSection,
  QImg,
  QIcon,
  QSeparator,
  QBtn,
} from 'quasar'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivePublicActivityService } from '@/activities/services'
import { createActivityTypeStylesheet } from '@/activities/stylesheet'
import { absoluteURL } from '@/utils/absoluteURL'

import StandardMap from '@/maps/components/StandardMap'
import KSpinner from '@/utils/components/KSpinner'
import Markdown from '@/utils/components/Markdown'

const { getTextClass, getIconProps, getTranslatedName } = useActivityTypeHelpers()

const { publicActivity } = useActivePublicActivityService()

const activityType = computed(() => publicActivity.value?.activityType)
const place = computed(() => publicActivity.value?.place)
const group = computed(() => place.value?.group)

const bannerImageURL = computed(() => publicActivity.value?.bannerImageUrls?.fullSize)
const groupImageURL = computed(() => group.value?.photoUrls?.[200])

const icsURL = computed(() => {
  if (!publicActivity.value) return ''
  return absoluteURL(`/api/public-activities/${publicActivity.value.publicId}/ics/`)
})

// Need this as we might not be signed in, so might not have any activity type stylesheet loaded
// (This enables the custom activity type colour names)
const { updateActivityTypes, removeStylesheet } = createActivityTypeStylesheet()
watch(activityType, value => updateActivityTypes([value]), { immediate: true })

onUnmounted(() => removeStylesheet())

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
