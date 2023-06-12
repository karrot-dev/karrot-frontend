<template>
  <SidenavBox>
    <template #icon>
      <QIcon
        name="fas fa-fw fa-star"
        color="secondary"
      />
    </template>
    <template #name>
      {{ $t('PLACE_LIST.FAVORITE_PLACES') }}
    </template>

    <KSpinner v-if="isLoadingPlaces" />

    <template v-else>
      <QList>
        <QItem
          v-for="place in subscribedPlaces"
          :key="place.id"
          :to="{ name: placeRoute(place), params: { groupId, placeId: place.id }}"
          :class="{'router-link-active': getIsActivePlace(place)}"
          dense
        >
          <QItemSection side>
            <QIcon
              v-bind="getPlaceIconProps(place)"
              size="1.1em"
            />
          </QItemSection>
          <QItemSection>
            <QItemLabel
              class="items-baseline"
            >
              {{ place.name }}
            </QItemLabel>
          </QItemSection>
          <QItemSection
            v-if="getUnreadWallMessageCount(place) > 0"
            side
          >
            <QBadge
              color="secondary"
            >
              {{ getUnreadWallMessageCount(place) > 99 ? '99+' : getUnreadWallMessageCount(place) }}
            </QBadge>
          </QItemSection>
        </QItem>
      </QList>

      <div v-if="subscribedPlaces.length < 1">
        <QBanner
          class="bg-info q-mx-md q-mb-xs"
          rounded
        >
          <i18n-t keypath="PLACE_LIST.SUBSCRIBE_HINT">
            <template #icon>
              <QIcon name="fas fa-star" />
            </template>
          </i18n-t>
        </QBanner>
      </div>

      <QItem
        :to="{ name: 'places', params: { groupId } }"
        dense
      >
        <QItemSection side>
          <QIcon
            name="fas fa-arrow-right"
            size="1.1em"
          />
        </QItemSection>
        <QItemSection>
          {{ $t('STOREEDIT.SHOW_ALL') }} ({{ activePlaceCount }})
        </QItemSection>
      </QItem>
    </template>
  </SidenavBox>
</template>

<script setup>
import {
  QIcon,
  QItemSection,
  QItem,
  QList,
  QItemLabel,
  QBadge,
  QBanner,
} from 'quasar'
import { computed } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { usePlaceHelpers } from '@/places/helpers'
import { placeRoute } from '@/places/utils'
import { useStatusService } from '@/status/services'

import KSpinner from '@/utils/components/KSpinner.vue'

import SidenavBox from './SidenavBox.vue'

const {
  getIsActivePlace,
  getPlaceIconProps,
} = usePlaceHelpers()

const {
  groupId,
  places,
  isLoadingPlaces,
} = useCurrentGroupService()

const {
  getPlaceStatus,
} = useStatusService()

function getUnreadWallMessageCount (place) {
  return getPlaceStatus(place.id).unreadWallMessageCount
}

const subscribedPlaces = computed(() => places.value.filter(place => place.isSubscribed && place.status !== 'archived'))
const activePlaceCount = computed(() => places.value.filter(place => place.status === 'active').length)
</script>

<style scoped lang="sass">
.tools
  .bottom-right
    top: 5px
    left: 5px
</style>
