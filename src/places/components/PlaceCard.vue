<template>
  <RouterLink :to="{ name: placeRoute(place), params: { placeId: place.id } }">
    <QCard>
      <QItem
        :style="headerStyle"
      >
        <QItemSection side>
          <PlaceIcon :place="place" />
        </QItemSection>
        <QItemSection>
          <QItemLabel
            class="ellipsis"
          >
            {{ place.name }}
          </QItemLabel>
          <QItemLabel
            caption
            class="row no-wrap items-center q-gutter-x-xs"
          >
            <div class="ellipsis">
              {{ placeTypeTranslatedName }}
            </div>
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
        class="row no-wrap overflow-hidden"
      >
        <RouterLink
          v-if="unreadWallMessageCount > 0"
          :to="{ name: 'placeWall', params: { placeId: place.id }}"
        >
          <QChip
            square
            size="sm"
            color="secondary"
            text-color="white"
            icon="fas fa-comments"
            :title="$tc('CONVERSATION.UNREAD_MESSAGES', unreadWallMessageCount, { count: unreadWallMessageCount })"
          >
            <strong class="q-ml-sm">
              {{ unreadWallMessageCount > 99 ? '99+' : unreadWallMessageCount }}
            </strong>
          </QChip>
        </RouterLink>
        <RouterLink
          :to="{ name: 'placeActivities', params: { placeId: place.id }}"
          :title="$tc('PLACE_LIST.UPCOMING_ACTIVITIES', activityCount, { count: activityCount })"
        >
          <QChip
            square
            size="sm"
            :color="activityCount > 0 ? 'secondary' : 'grey'"
            text-color="white"
            icon="fas fa-asterisk"
          >
            <strong class="q-ml-sm">
              {{ activityCount || 0 }}
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
      <template v-if="place.isArchived">
        <div class="absolute-full dimmed" />
        <div class="absolute-full flex flex-center text-h4 text-uppercase text-bold">
          {{ t('LABELS.ARCHIVED') }}
        </div>
      </template>
    </QCard>
  </RouterLink>
</template>
<script setup>
import {
  QCard,
  QBtn,
  QItem,
  QItemSection,
  QItemLabel,
  QChip,
  QSpace,
  QCardActions,
  QSeparator,
  colors,
} from 'quasar'
import { computed } from 'vue'

import { usePlaceStatus, usePlaceType, usePlaceTypeTranslatedName } from '@/places/helpers'
import { usePlaceSubscribeMutation, usePlaceUnsubscribeMutation } from '@/places/mutations'
import { placeRoute } from '@/places/utils'
import { usePlaceNotificationStatus } from '@/status/services'

import PlaceIcon from '@/places/components/PlaceIcon.vue'
import Markdown from '@/utils/components/Markdown.vue'

const { lighten } = colors

const props = defineProps({
  place: {
    required: true,
    type: Object,
  },
  activityCount: {
    default: 0,
    type: Number,
  },
})

const { mutate: subscribe } = usePlaceSubscribeMutation()
const { mutate: unsubscribe } = usePlaceUnsubscribeMutation()

const placeStatus = usePlaceStatus(props.place.status)

const placeNotificationStatus = usePlaceNotificationStatus(props.place.id)
const unreadWallMessageCount = computed(() => placeNotificationStatus.value?.unreadWallMessageCount)
const placeType = usePlaceType(props.place.placeType)
const placeTypeTranslatedName = usePlaceTypeTranslatedName(placeType.value)

const headerStyle = computed(() => ({
  background: `linear-gradient(170deg, ${lighten(placeStatus.value.colour, 75)}, ${lighten(placeStatus.value.colour, 85)})`,
}))

</script>

<style scoped lang="sass">
.limit-height
  position: relative
  min-height: 140px
  max-height: 140px
  overflow-y: hidden
</style>
