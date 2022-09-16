<template>
  <SidenavBox>
    <template #icon>
      <QIcon
        name="fas fa-fw fa-star"
        color="secondary"
      />
    </template>
    <template #name>
      Your places (TODO)
    </template>

    <KSpinner v-if="isLoadingPlaces" />
    <QList v-else>
      <QItem
        v-for="place in places.filter(place => place.isSubscribed)"
        :key="place.id"
        :to="{ name: 'place', params: { groupId, placeId: place.id }}"
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
    <QItem
      v-if="placeCount > 0"
      :to="{ name: 'places', params: { groupId } }"
      dense
    >
      <QItemSection>
        {{ $t('STOREEDIT.SHOW_ALL', { count: placeCount }) }}
      </QItemSection>
    </QItem>
    <QItem
      v-if="placeCount < 1 && isEditor"
      :to="{ name: 'placeCreate', params: { groupId } }"
      class="bg-secondary justify-center"
      :title="$t('BUTTON.CREATE')"
      dense
    >
      <QItemSection side>
        <QIcon
          name="add_circle"
          color="white"
          size="1.5em"
        />
      </QItemSection>
    </QItem>
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
} from 'quasar'
import { computed } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { usePlaceHelpers } from '@/places/helpers'
import { useStatusService } from '@/status/services'

import KSpinner from '@/utils/components/KSpinner'

import SidenavBox from './SidenavBox'

const {
  getIsActivePlace,
  getPlaceIconProps,
} = usePlaceHelpers()

const {
  isEditor,
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

const placeCount = computed(() => places.value.filter(place => place.status === 'active').length)
</script>

<style scoped lang="sass">
.tools
  .bottom-right
    top: 5px
    left: 5px
</style>
