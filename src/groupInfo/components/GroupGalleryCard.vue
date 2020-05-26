<template>
  <div class="inline-block">
    <QCard
      class="groupPreviewCard relative-position"
      :class="{
        application: group.myApplicationPending,
        highlight: group.isCurrentGroup,
      }"
      :style="cardStyle"
      @click="$emit(group.isMember ? 'visit' : 'preview')"
    >
      <QBadge
        v-if="group.myApplicationPending"
        floating
        class="q-pl-sm q-pt-xs q-pb-xs z-top"
        color="blue"
      >
        <QIcon name="fas fa-hourglass-half" />
      </QBadge>
      <QTooltip v-if="group.myApplicationPending">
        {{ $t('APPLICATION.GALLERY_TOOLTIP') }}
      </QTooltip>
      <div
        class="photo text-white relative-position row justify-center"
      >
        <img
          v-if="group.hasPhoto"
          :src="group.photoUrls['200']"
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
            <span
              v-measure
              class="row group items-start text-h6"
            >
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
          icon="fas fa-info-circle"
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
    cardStyle () {
      const reduceOpacity = this.group.isInactive && !this.group.isMember
      if (reduceOpacity) {
        return { opacity: 0.5 }
      }
      return {}
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.groupPreviewCard
  cursor pointer
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, 0.2)

  &:hover
    box-shadow 0 7px 11px 0 rgba(0, 0, 0, 0.2)

  *
    overflow hidden

  &.highlight
    border 2px solid $secondary

  &.application
    border 2px solid $blue

  .fixed-height
    position relative
    min-height 80px
    max-height 80px

    &:before
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      content ''
      background linear-gradient(transparent 80%, white)

  .smaller-text >>> *
    font-size 1em

  .photo
    height 160px

    img
      display block
      width auto
      height 100%

    .k-media-overlay
      background-color rgba(0, 0, 0, 0.47)
</style>
