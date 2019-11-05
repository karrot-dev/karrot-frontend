<template>
  <QList>
    <QItem
      v-for="place in sortedPlaces"
      :key="place.id"
      :to="linkParamsFor(place)"
      :class="{'router-link-active': place.isActivePlace}"
      dense
    >
      <QItemSection side>
        <QIcon
          :name="place.ui.icon"
          :color="place.ui.color"
          :title="$t(place.ui.label)"
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
        v-if="place.conversationUnreadCount > 0"
        side
      >
        <QBadge
          color="secondary"
        >
          {{ place.conversationUnreadCount > 99 ? '99+' : place.conversationUnreadCount }}
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
import { mapGetters } from 'vuex'

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
  computed: {
    sortedPlaces () {
      const subscribed = this.places.filter(e => e.isSubscribed)
      const notSubscribed = this.places.filter(e => !e.isSubscribed)
      return subscribed.concat(notSubscribed)
    },
    hasPlaces () {
      return this.places && this.places.length > 0
    },
    ...mapGetters({
      isEditor: 'currentGroup/isEditor',
    }),
  },
  methods: {
    linkParamsFor (place) {
      return {
        name: this.linkTo,
        params: {
          groupId: place.group.id,
          placeId: place.id,
        },
      }
    },
  },
}
</script>
