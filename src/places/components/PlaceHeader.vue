<template>
  <div>
    <KSpinner v-show="!place" />
    <div v-if="place">
      <RandomArt
        :seed="placeId"
        type="banner"
      />
    </div>
    <div
      v-if="place"
      class="toolbar row justify-between bg-white q-pb-xs"
    >
      <QChip
        icon="fas fa-star"
        color="secondary"
        text-color="white"
        square
        :title="$t('PLACEWALL.SUBSCRIBED_USERS', { count: subscribers.length })"
        class="self-center q-ml-sm cursor-pointer"
        style="z-index: 0"
      >
        <strong>{{ subscribers.length }}</strong>
        <QMenu>
          <div
            v-if="subscribers"
            v-close-popup
            class="q-pa-md"
          >
            <div class="row">
              <ProfilePicture
                v-for="user in subscribers"
                :key="user.id"
                :user="user"
                :size="20"
                class="q-mr-xs"
              />
            </div>
            <div class="text-caption q-mt-sm">
              {{ $t('PLACEWALL.SUBSCRIBED_USERS', { count: subscribers.length }) }}
            </div>
          </div>
        </QMenu>
      </QChip>
      <div>
        <QBtn
          round
          color="white"
          :icon="selected.icon"
          :text-color="selected.color"
          :title="$t('PLACEWALL.SUBSCRIPTION.HEADER')"
        >
          <QMenu>
            <QList>
              <QItemLabel
                header
              >
                <span v-t="'PLACEWALL.SUBSCRIPTION.HEADER'" />
              </QItemLabel>

              <QItem
                v-for="o in options"
                :key="o.id"
                v-close-popup
                :class="o.selected ? 'bg-grey-2' : ''"
                clickable
                @click="select(o)"
              >
                <QItemSection side>
                  <QIcon
                    :name="o.icon"
                    :color="o.color"
                  />
                </QItemSection>
                <QItemSection>
                  <QItemLabel>
                    {{ o.label }}
                  </QItemLabel>
                  <QItemLabel caption>
                    {{ o.sublabel }}
                  </QItemLabel>
                </QItemSection>
              </QItem>
            </QList>
          </QMenu>
        </QBtn>
        <MeetButton
          small
          round
          color="secondary"
          :room="`place:${place.id}`"
        />
        <component
          :is="directionsURL ? 'a' : 'span'"
          target="_blank"
          rel="noopener nofollow noreferrer"
          :href="directionsURL"
        >
          <QBtn
            round
            :color="directionsURL ? 'secondary' : 'grey'"
            icon="directions"
            :disable="!directionsURL"
            :title="$t('STOREDETAIL.DIRECTIONS')"
          />
        </component>
        <QBtn
          v-if="isEditor"
          small
          round
          color="secondary"
          icon="fas fa-pencil-alt"
          :to="{name: 'placeEdit'}"
          :title="$t('STOREDETAIL.EDIT')"
        />
      </div>
    </div>
    <div
      v-if="place"
      class="bg-white q-py-sm q-px-md cursor-pointer"
    >
      <ShowMore
        v-if="place.description"
        :height="200"
      >
        <Markdown
          :source="place.description"
          mentions
        />
      </ShowMore>
      <div v-else>
        <span class="text-italic">
          {{ $t("STOREDETAIL.NO_DESCRIPTION") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  QSeparator,
  QBtn,
  QTooltip,
  QMenu,
  QList,
  QItemLabel,
  QItem,
  QItemSection,
  QChip,
  QCard,
  QCardSection,
  QIcon,
} from 'quasar'
import { computed } from 'vue'

import { useAuthService } from '@/authuser/services'
import { useCurrentGroupService, useHasFeature } from '@/group/services'
import directions from '@/maps/directions'
import { useRoomService } from '@/meet/helpers'
import { usePlaceSubscribeMutation, usePlaceUnsubscribeMutation } from '@/places/mutations'
import { useActivePlaceService } from '@/places/services'
import { useUserService } from '@/users/services'

import StandardMap from '@/maps/components/StandardMap.vue'
import { placeMarker } from '@/maps/components/markers'
import MeetButton from '@/meet/components/MeetButton.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'
import KSpinner from '@/utils/components/KSpinner.vue'
import Markdown from '@/utils/components/Markdown.vue'
import RandomArt from '@/utils/components/RandomArt.vue'
import ShowMore from '@/utils/components/ShowMore.vue'

export default {
  components: {
    MeetButton,
    ShowMore,
    Markdown,
    StandardMap,
    RandomArt,
    KSpinner,
    ProfilePicture,
    QSeparator,
    QBtn,
    QTooltip,
    QMenu,
    QList,
    QItemLabel,
    QItem,
    QItemSection,
    QChip,
    QCard,
    QCardSection,
    QIcon,
  },
  setup () {
    const { user: currentUser } = useAuthService()
    const { isEditor } = useCurrentGroupService()
    const { placeId, place } = useActivePlaceService()
    const { getUserById } = useUserService()
    const subscribers = computed(() => place.value.subscribers.map(getUserById))

    const { mutate: subscribe } = usePlaceSubscribeMutation()
    const { mutate: unsubscribe } = usePlaceUnsubscribeMutation()

    return {
      placeId,
      place,
      isEditor,
      currentUser,
      subscribers,
      subscribe,
      unsubscribe,
    }
  },
  computed: {
    markers () {
      return this.place ? [placeMarker(this.place)] : []
    },
    directionsURL () {
      if (!this.place || !this.place.latitude || !this.place.longitude) return
      if (this.$q.platform.is.ios) {
        return directions.apple(this.place)
      }
      if (this.$q.platform.is.android) {
        return directions.google(this.place)
      }
      return directions.osm(this.currentUser, this.place)
    },
    isSubscribed () {
      return this.place && this.place.isSubscribed
    },
    options () {
      return [
        {
          id: 'subscribe',
          label: this.$t('PLACEWALL.SUBSCRIPTION.YES'),
          sublabel: this.$t('PLACEWALL.SUBSCRIPTION.YES_TEXT'),
          icon: 'fas fa-fw fa-star',
          color: 'secondary',
          selected: this.isSubscribed,
        },
        {
          id: 'unsubscribe',
          label: this.$t('PLACEWALL.SUBSCRIPTION.NO'),
          sublabel: this.$t('PLACEWALL.SUBSCRIPTION.NO_TEXT'),
          icon: 'fas fa-fw fa-star',
          color: 'grey',
          selected: !this.isSubscribed,
        },
      ]
    },
    selected () {
      return this.options.find(o => o.selected)
    },
    groupId () {
      return this.place && this.place.group && this.place.group.id
    },
  },
  methods: {
    select (option) {
      if (option.id === 'subscribe') {
        this.subscribe(this.placeId)
      }
      else {
        this.unsubscribe(this.placeId)
      }
    },
  },
}
</script>

<style scoped lang="sass">
.q-btn-round
  margin-bottom: .5em

.toolbar
  margin-top: -24px

.toolbar .q-btn
  margin: 3px

.map
  height: 30vh

.limit-height
  position: relative
  max-height: 10rem
  overflow-y: hidden

  &:before
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    content: ''
    background: linear-gradient(rgba(255, 255, 255, 0) 90%, white 100%)
</style>
