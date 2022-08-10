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
          <QIcon
            v-if="place.isSubscribed"
            name="fas fa-fw fa-star"
            class="vertical-baseline q-ml-xs"
            color="secondary"
          />
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

    <QItem
      v-if="!hasPlaces && isEditor"
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

    <QSeparator v-if="archived.length > 0" />

    <QExpansionItem
      v-if="archived.length > 0 && isEditor"
      icon="fas fa-trash-alt"
      :label="`${$t('STORESTATUS.ARCHIVED')} (${archived.length})`"
    >
      <QItem
        v-for="place in archived"
        :key="place.id"
        :to="linkParamsFor(place)"
        :class="{'router-link-active': place.isActivePlace}"
        dense
      >
        <QItemSection>
          <QItemLabel>
            {{ place.name }}
          </QItemLabel>
        </QItemSection>
      </QItem>
    </QExpansionItem>
  </QList>
</template>

<script>
import {
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QExpansionItem,
  QSeparator,
  QBadge,
} from 'quasar'

import { usePlaceHelpers } from '@/places/helpers'
import { useStatusService } from '@/status/services'
import { useCurrentGroupService } from '@/group/services'

export default {
  components: {
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
    QExpansionItem,
    QSeparator,
    QBadge,
  },
  props: {
    groupId: {
      default: null,
      type: Number,
    },
    places: {
      required: true,
      type: Array,
    },
    archived: {
      default: () => [],
      type: Array,
    },
    linkTo: {
      default: 'place',
      type: String,
    },
  },
  setup () {
    const {
      getIsActivePlace,
      getPlaceIconProps,
    } = usePlaceHelpers()

    const {
      isEditor,
    } = useCurrentGroupService()

    const {
      getPlaceStatus,
    } = useStatusService()

    function getUnreadWallMessageCount (place) {
      return getPlaceStatus(place.id).unreadWallMessageCount
    }

    return {
      isEditor,
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
    hasPlaces () {
      return this.places && this.places.length > 0
    },
  },
  methods: {
    linkParamsFor (place) {
      return {
        name: this.linkTo,
        params: {
          groupId: place.group,
          placeId: place.id,
        },
      }
    },
  },
}
</script>
