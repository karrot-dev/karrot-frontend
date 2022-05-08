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
        <QImg
          v-if="group.hasPhoto"
          :alt="group.name || ''"
          :src="group.photoUrls['200']"
          :ratio="1"
          contain
          no-spinner
        />
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
              {{ group.memberCount }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.memberCount) }}
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
      <QSeparator v-if="group.isMember" />
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
  QImg,
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
    QImg,
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
  emits: [
    'visit',
    'preview',
  ],
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

<style scoped lang="sass">
.groupPreviewCard
  cursor: pointer
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.15)

  &:hover
    box-shadow: rgba(0, 0, 0, 0.09) 0px 4px 16px, rgba(0, 0, 0, 0.09) 0px 8px 24px, rgba(0, 0, 0, 0.09) 0px 16px 56px

  *
    overflow: hidden

  &.highlight
    border: 2px solid $secondary

  &.application
    border: 2px solid $blue

  .fixed-height
    position: relative
    min-height: 80px
    max-height: 80px

    &:before
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      content: ''
      background: linear-gradient(rgba(255, 255, 255, 0) 80%, white 100%)

  .smaller-text ::v-deep(*)
    font-size: 1em

  .photo,
  .q-img
    height: 160px

    .k-media-overlay
      background-color: rgba(0, 0, 0, 0.47)
</style>
