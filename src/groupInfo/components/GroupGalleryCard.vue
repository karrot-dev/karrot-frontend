<template>
  <div class="inline-block">
    <QCard
      class="groupPreviewCard relative-position"
      :class="{
        application: hasMyApplication,
        highlight: group.isCurrentGroup,
      }"
      :style="cardStyle"
      @click="$emit(group.isMember ? 'visit' : 'preview')"
    >
      <QBadge
        v-if="hasMyApplication"
        floating
        class="q-pl-sm q-pt-xs q-pb-xs"
        color="blue"
        icon="fas fa-hourglass-half"
      />
      <QTooltip v-if="hasMyApplication">
        {{ $t('APPLICATION.GALLERY_TOOLTIP') }}
      </QTooltip>
      <div
        class="photo text-white relative-position row justify-center"
      >
        <img
          v-if="group.hasPhoto"
          :src="group.photoUrls.fullSize"
        >
        <RandomArt
          v-else
          :seed="group.id"
          type="circles"
          class="full-height"
        />
        <div class="absolute-bottom k-media-overlay q-pa-md">
          <div
            class="ellipsis"
          >
            <span class="row group items-start text-h6">
              {{ group.name }}
              <QIcon
                v-if="group.isPlayground"
                name="fas fa-child"
              />
            </span>
            <span class="text-subtitle2">
              {{ group.members.length }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.members.length) }}
            </span>
          </div>
        </div>
      </div>
      <QCardSection class="fixed-height smaller-text">
        <div
          v-if="group.publicDescription"
        >
          <Markdown :source="group.publicDescription.slice(0, 300)" />
        </div>
        <span
          v-else
          class="text-italic"
        >
          {{ $t('JOINGROUP.NO_PUBLIC_DESCRIPTION') }}
        </span>
        <div class="overlay" />
      </QCardSection>
      <QSeparator />
      <QCardActions v-if="group.isMember">
        <QBtn
          flat
          size="sm"
          icon="fas fa-home"
          @click.stop="$emit('visit')"
        >
          <QTooltip>
            {{ $t('GROUPINFO.MEMBER_VIEW') }}
          </QTooltip>
        </QBtn>
        <QBtn
          flat
          size="sm"
          :icon="$icon('info_circle')"
          @click.stop="$emit('preview')"
        >
          <QTooltip>
            {{ $t('GROUPINFO.META') }}
          </QTooltip>
        </QBtn>
      </QCardActions>
    </QCard>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  QCard,
  QCardSection,
  QSeparator,
  QCardActions,
  QBtn,
  QTooltip,
  QIcon,
  QBadge,
} from 'quasar'
import Markdown from '@/utils/components/Markdown'
import RandomArt from '@/utils/components/RandomArt'

export default {
  components: {
    Markdown,
    RandomArt,
    QCard,
    QCardSection,
    QSeparator,
    QCardActions,
    QBtn,
    QTooltip,
    QIcon,
    QBadge,
  },
  props: {
    group: {
      type: Object,
      default: () => ({
        members: [],
      }),
    },
  },
  computed: {
    ...mapGetters({
      getMyApplicationInGroup: 'applications/getMineInGroup',
    }),
    cardStyle () {
      const reduceOpacity = this.group.isInactive && !this.group.isMember
      if (reduceOpacity) {
        return { opacity: 0.5 }
      }
      return {}
    },
    myApplication () {
      if (!this.group) return
      return this.getMyApplicationInGroup(this.group.id)
    },
    hasMyApplication () {
      return Boolean(this.myApplication)
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.groupPreviewCard
  cursor pointer
  box-shadow 0 2px 6px 0 rgba(0,0,0,0.2)
  &:hover
    box-shadow 0 7px 11px 0 rgba(0,0,0,0.2)
  *
    overflow hidden
  &.highlight
    border 2px solid $secondary
  &.application
    border 2px solid $blue
  .fixed-height
    min-height 80px
    max-height 80px
    position relative
    &:before
      content ''
      width 100%
      height 100%
      position absolute
      top 0
      left 0
      background linear-gradient(transparent 80%, white)
  .smaller-text >>> *
    font-size 1em
  .photo
    height 160px
    img
      max-height 100%
      max-width 100%
      width auto
      margin 0 auto
    .k-media-overlay
      background-color rgba(0,0,0,0.47)
</style>
