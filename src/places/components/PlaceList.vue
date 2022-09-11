<template>
  <QList>
    <template
      v-for="{ placeType, filteredPlaces } in placeTypesWithPlaces"
      :key="placeType.id"
    >
      <QItemLabel
        v-if="placeTypesWithPlaces.length > 1"
        header
      >
        {{ placeType.name }}
      </QItemLabel>
      <QItem
        v-for="place in filteredPlaces"
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
    </template>

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
import { computed, toRefs } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { usePlaceHelpers } from '@/places/helpers'
import { usePlaceTypeService } from '@/places/services'
import { useStatusService } from '@/status/services'

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
  setup (props) {
    const { places } = toRefs(props)

    const {
      getIsActivePlace,
      getPlaceIconProps,
    } = usePlaceHelpers()

    const {
      getPlaceTypesByGroup,
    } = usePlaceTypeService()

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

    // TODO sorting?
    // ideally user-defined, but at least shouldn't change when changing locales?
    // maybe just by untranslated name for now?
    const placeTypes = computed(() => getPlaceTypesByGroup(groupId.value))

    const sortedPlaces = computed(() => {
      const subscribed = places.value.filter(e => e.isSubscribed)
      const notSubscribed = places.value.filter(e => !e.isSubscribed)
      return subscribed.concat(notSubscribed)
    })

    // We only show types that also have places
    const placeTypesWithPlaces = computed(() => placeTypes.value.map(placeType => ({
      placeType,
      filteredPlaces: sortedPlaces.value.filter(place => place.placeType === placeType.id),
    })).filter(({ filteredPlaces }) => filteredPlaces.length > 0))

    return {
      isEditor,
      placeTypesWithPlaces,
      getIsActivePlace,
      getPlaceIconProps,
      getUnreadWallMessageCount,
    }
  },
  computed: {
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
