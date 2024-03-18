<template>
  <div v-if="publicActivities.length">
    <QInfiniteScroll v-bind="infiniteScroll">
      <QCardSection
        class="row public-activities"
      >
        <div
          v-for="publicActivity in publicActivities"
          :key="publicActivity.publicId"
          class="col-12 col-sm-4 smaller-text"
        >
          <QCard
            v-ripple
            flat
            bordered
            class="cursor-pointer q-hoverable block"
            target="_blank"
            tag="a"
            :href="$router.resolve({ name: 'publicActivity', params: { activityPublicId: publicActivity.publicId } }).href"
          >
            <QImg
              v-if="getBannerImageUrl(publicActivity)"
              :src="getBannerImageUrl(publicActivity)"
              class="full-width"
              style="max-height: 80px;"
            />
            <QItem>
              <QItemSection
                avatar
                style="min-width: unset;"
              >
                <QIcon
                  v-bind="getIconProps(publicActivity.activityType)"
                  class="q-pr-xs"
                  :style="{ color: '#' + publicActivity.activityType.colour }"
                />
              </QItemSection>
              <QItemSection>
                <QItemLabel
                  :style="{ color: '#' + publicActivity.activityType.colour }"
                >
                  {{ getTranslatedName(publicActivity.activityType) }}
                </QItemLabel>
                <QItemLabel>
                  {{ $d(publicActivity.date, 'shortDateAndTime') }}
                </QItemLabel>
              </QItemSection>
            </QItem>
            <QSeparator />
            <QCardSection>
              <Markdown
                :source="publicActivity.description"
              />
            </QCardSection>
          </QCard>
        </div>
      </QCardSection>
    </QInfiniteScroll>
  </div>
</template>

<script setup>
import {
  QCard,
  QCardSection,
  QSeparator,
  QIcon,
  QImg,
  QInfiniteScroll,
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { usePublicActivityListQuery } from '@/activities/queries'
import { useIntegerRouteParam } from '@/utils/composables'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'

import Markdown from '@/utils/components/Markdown.vue'

const { getIconProps, getTranslatedName } = useActivityTypeHelpers()

const groupId = useIntegerRouteParam('groupId')

const route = useRoute()

const placeId = computed(() => route.query.place)
const activityTypeId = computed(() => route.query.type)

const {
  publicActivities,
  infiniteScroll,
} = usePublicActivityListQuery({
  groupId,
  dateMin: newDateRoundedTo5Minutes(),
  placeId,
  activityTypeId,
})

function getBannerImageUrl (publicActivity) {
  return publicActivity?.bannerImageUrls?.fullSize ?? publicActivity?.seriesBannerImageUrls?.fullSize
}

</script>

<style scoped lang="sass">
::v-deep(.q-banner__avatar)
  align-self: center

::v-deep(.q-banner__content)
  min-width: 200px

.q-card
  overflow: hidden
  &:hover
    border-color: $primary

.photo
  &.hasPhoto
    height: 350px

  &:not(.hasPhoto)
    height: 140px

  img
    width: auto
    max-width: 100%
    max-height: 100%
    margin: 0 auto

  .k-media-overlay
    background-color: rgba(0, 0, 0, 0.47)

.public-activities
  .q-card
    height: 220px
</style>
