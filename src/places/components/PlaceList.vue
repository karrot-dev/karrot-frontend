<template>
  <QList>
    <QItem
      v-for="place in sortedPlaces"
      :key="place.id"
      :to="linkParamsFor(place)"
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
</template>

<script>
import {
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QBadge,
} from 'quasar'

import { useCurrentGroupService } from '@/group/services'
import { usePlaceHelpers } from '@/places/helpers'
import { useStatusService } from '@/status/services'

export default {
  components: {
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
    QBadge,
  },
  props: {
    places: {
      required: true,
      type: Array,
    },
  },
  setup () {
    const {
      getIsActivePlace,
      getPlaceIconProps,
    } = usePlaceHelpers()

    const {
      isEditor,
      groupId,
    } = useCurrentGroupService()

    const {
      getPlaceStatus,
    } = useStatusService()

    function getUnreadWallMessageCount (place) {
      return getPlaceStatus(place.id).unreadWallMessageCount
    }

    return {
      isEditor,
      groupId,
      getIsActivePlace,
      getPlaceIconProps,
      getUnreadWallMessageCount,
    }
  },
  computed: {
    sortedPlaces () {
      const subscribed = this.places.filter(e => e.isSubscribed)
      const notSubscribed = this.places.filter(e => !e.isSubscribed)
      return subscribed.concat(notSubscribed)
    },
  },
  methods: {
    linkParamsFor (place) {
      return {
        name: 'place',
        params: {
          groupId: place.group,
          placeId: place.id,
        },
      }
    },
  },
}
</script>
