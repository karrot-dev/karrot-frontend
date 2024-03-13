<template>
  <QCard v-if="publicActivity">
    <QImg
      v-if="bannerImageURL"
      :src="bannerImageURL"
    />
    <div class="full-width text-h5 q-pa-md row q-gutter-y-md">
      <RouterLink
        :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }"
      >
        {{ group.name }}
      </RouterLink>
      <span class="q-px-sm text-grey">/</span>
      <span :class="getTextClass(activityType)">
        <QIcon
          v-bind="getIconProps(activityType)"
          size="md"
          class="q-pr-sm"
        />{{ getTranslatedName(activityType) }}
      </span>
      <QSpace />
      <QBtnGroup
        outline
        class="bg-white"
      >
        <QBtn
          outline
          no-caps
          type="a"
          color="black"
          @click="share"
        >
          <template #default>
            <QIcon
              name="fas fa-share-alt"
              size="xs"
              class="q-mr-xs"
            />
            <span>Share</span>
          </template>
        </QBtn>
        <QBtn
          v-if="icsUrl"
          :href="icsUrl"
          outline
          no-caps
          type="a"
          color="black"
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
      </QBtnGroup>
    </div>
    <QSeparator />
    <QCardSection>
      <div class="row">
        <div class="activity-description col-12 col-sm-8">
          <Markdown
            :source="publicActivity.description"
            class="q-pl-lg q-pr-lg"
          />
        </div>
        <div
          class="activity-info col-12 col-sm-4 q-pl-md q-pb-md"
        >
          <RouterLink
            v-if="groupImageURL"
            class="q-mb-md text-center block"
            :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }"
          >
            <QImg
              :src="groupImageURL"
              width="100px"
            />
          </RouterLink>
          <div>
            <div class="text-h6 q-mt-sm q-mb-sm">
              <QIcon
                v-bind="getIconProps(activityType)"
                color="grey"
                class="q-pr-xs"
              />
              {{ $t('ACTIVITYLIST.PUBLIC.WHAT') }}
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
            {{ $t('ACTIVITYLIST.PUBLIC.WHEN') }}
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
            {{ $t('ACTIVITYLIST.PUBLIC.WHERE') }}
          </div>
          {{ place.name }}<br>
          {{ place.address }}
        </div>
      </div>
    </QCardSection>
    <div
      v-if="mapMarker"
      style="height: 300px;"
    >
      <StandardMap
        :markers="[mapMarker]"
        :scroll-wheel-zoom="false"
      />
    </div>
    <template v-if="group.publicDescription">
      <QSeparator />
      <QCardSection
        class="q-pb-xl"
      >
        <RouterLink
          v-if="groupImageURL"
          class="q-my-lg text-center block"
          :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }"
        >
          <QImg
            :src="groupImageURL"
            width="100px"
          />
        </RouterLink>
        <div class="text-center text-h6 q-mb-md">
          {{ group.name }}
        </div>
        <Markdown
          :source="group.publicDescription"
          style="max-width: 400px; margin: 0 auto;"
          class="text-muted"
        />
        <div class="text-center q-py-lg">
          <QBtn
            color="secondary"
            unelevated
            :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }"
          >
            {{ $t('BUTTON.GO_TO_GROUP') }} &rarr;
          </QBtn>
        </div>
      </QCardSection>
    </template>
  </QCard>
  <KSpinner v-else />
</template>

<script setup>
import {
  QCard,
  QCardSection,
  QImg,
  QIcon,
  QSeparator,
  QBtn,
  QBtnGroup,
  QSpace,
  Dialog,
} from 'quasar'
import { onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivePublicActivityService } from '@/activities/services'
import { createActivityTypeStylesheet } from '@/activities/stylesheet'
import { absoluteURL } from '@/utils/absoluteURL'

import ShareDialog from '@/activities/components/ShareDialog.vue'
import StandardMap from '@/maps/components/StandardMap.vue'
import KSpinner from '@/utils/components/KSpinner.vue'
import Markdown from '@/utils/components/Markdown.vue'

const router = useRouter()

const { getTextClass, getIconProps, getTranslatedName } = useActivityTypeHelpers()

const { publicActivity } = useActivePublicActivityService()

const activityType = computed(() => publicActivity.value?.activityType)
const place = computed(() => publicActivity.value?.place)
const group = computed(() => place.value?.group)

const bannerImageURL = computed(() => publicActivity.value?.bannerImageUrls?.fullSize ?? publicActivity.value?.seriesBannerImageUrls?.fullSize)
const groupImageURL = computed(() => group.value?.photoUrls?.[200])

const icsUrl = computed(() => {
  if (!publicActivity.value) return ''
  return absoluteURL(`/api/public-activities/${publicActivity.value.publicId}/ics/`)
})

// Need this as we might not be signed in, so might not have any activity type stylesheet loaded
// (This enables the custom activity type colour names)
const { updateEntries, removeStylesheet } = createActivityTypeStylesheet()
watch(activityType, value => updateEntries(value ? [value] : []), { immediate: true })

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

function share () {
  Dialog.create({
    component: ShareDialog,
    componentProps: {
      linkToCopy: absoluteURL(router.resolve({
        name: 'publicActivity',
        params: { activityPublicId: publicActivity.value.publicId },
      }).href),
    },
  })
}
</script>

<style scoped lang="sass">
.activity-info
  border: none
  border-left: 1px solid #eee

@media (max-width: $breakpoint-xs-max)
  .activity-info
    border: none
    border-bottom: 1px solid #eee

  .activity-description
    // when it gets narrow put the info at the top
    order: 2
</style>
