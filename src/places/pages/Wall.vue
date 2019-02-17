<template>
  <div>
    <QCard class="no-shadow no-padding grey-border relative-position">
      <RandomArt
        :seed="placeId"
        type="banner"
      />
      <div class="generic-padding">
        <div class="actionButtons">
          <QBtn
            round
            color="white"
            class="hoverScale"
            :icon="selected.icon"
            :text-color="selected.color"
          >
            <QPopover>
              <QList
                link
                v-close-overlay
              >
                <QListHeader
                  v-t="'PLACEWALL.SUBSCRIPTION.HEADER'"
                />

                <QItem
                  v-for="o in options"
                  :key="o.id"
                  @click.native="select(o)"
                  :class="o.selected ? 'bg-grey-2' : ''"
                >
                  <QItemSide
                    :color="o.color"
                    :icon="o.icon"
                  />
                  <QItemMain
                    :label="o.label"
                    :sublabel="o.sublabel"
                  />
                </QItem>
              </QList>
            </QPopover>
          </QBtn>
          <QBtn
            v-if="isEditor"
            :to="{name: 'placeEdit', params: { groupId, placeId }}"
            round
            color="secondary"
            icon="fas fa-pencil-alt"
            class="hoverScale"
          >
            <QTooltip v-t="'STOREDETAIL.EDIT'" />
          </QBtn>
        </div>
        <Markdown
          v-if="place && place.description"
          :source="place.description"
        />
        <i v-else>
          {{ $t("STOREDETAIL.NO_DESCRIPTION") }}
        </i>
      </div>
    </QCard>

    <WallConversation
      class="q-pt-lg"
      :data="conversation"
      :user="user"
      :fetch-past="fetchPast"
      @send="send"
      @saveMessage="saveMessage"
      @markAllRead="markAllRead"
      @saveConversation="saveConversation"
      @toggleReaction="toggleReaction"
      @openThread="openThread"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import WallConversation from '@/messages/components/WallConversation'
import RandomArt from '@/utils/components/RandomArt'
import Markdown from '@/utils/components/Markdown'

import {
  QBtn,
  QPopover,
  QTooltip,
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QListHeader,
  QCard,
} from 'quasar'

export default {
  components: {
    WallConversation,
    RandomArt,
    Markdown,
    QBtn,
    QPopover,
    QTooltip,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QListHeader,
    QCard,
  },
  computed: {
    ...mapGetters({
      placeId: 'places/activePlaceId',
      place: 'places/activePlace',
      isEditor: 'currentGroup/isEditor',
      conversation: 'places/conversation',
      user: 'auth/user',
    }),
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
    ...mapActions({
      subscribe: 'places/subscribe',
      unsubscribe: 'places/unsubscribe',
      openThread: 'detail/openForThread',
      send: 'conversations/send',
      saveMessage: 'conversations/saveMessage',
      saveConversation: 'conversations/maybeSave',
      markAllRead: 'conversations/markAllRead',
      toggleReaction: 'conversations/toggleReaction',
      fetchPast: 'conversations/fetchPast',
    }),
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

<style lang="stylus" scoped>
.actionButtons
  position absolute
  top 22px
  right 6px
  .q-btn
    margin 3px
</style>
