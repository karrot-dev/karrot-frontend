<template>
  <div class="inline-block">
    <QCard
      class="groupPreviewCard relative-position"
      :class="{
        application: hasMyApplication,
        highlight: group.isCurrentGroup,
      }"
      :style="cardStyle"
      @click.native="$emit(group.isMember ? 'visit' : 'preview')"
    >
      <QChip
        v-if="hasMyApplication"
        floating
        class="q-pl-sm q-pt-xs q-pb-xs"
        color="blue"
        icon="fas fa-hourglass-half"
      />
      <QTooltip v-if="hasMyApplication">
        {{ $t('APPLICATION.GALLERY_TOOLTIP') }}
      </QTooltip>
      <QCardMedia
        class="photo"
      >
        <img
          v-if="group.hasPhoto"
          :src="group.photoUrls.fullSize">
        <RandomArt
          v-else
          :seed="group.id"
          type="circles"
          class="full-height"
        />
        <QCardTitle
          slot="overlay"
          class="ellipsis"
        >
          <span class="row group items-start">
            {{ group.name }}
            <QIcon
              v-if="group.isPlayground"
              name="fas fa-child"
            />
          </span>
          <span slot="subtitle">
            {{ group.members.length }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.members.length) }}
          </span>
        </QCardTitle>
      </QCardMedia>
      <QCardMain class="fixed-height smaller-text">
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
      </QCardMain>
      <QCardSeparator />
      <QCardActions v-if="group.isMember">
        <QBtn
          @click.stop="$emit('visit')"
          class="q-btn-flat"
        >
          <QIcon name="fas fa-home" />
          <QTooltip>
            {{ $t('GROUPINFO.MEMBER_VIEW') }}
          </QTooltip>
        </QBtn>
        <QBtn
          @click.stop="$emit('preview')"
          class="q-btn-flat"
        >
          <QIcon name="fas fa-info-circle" />
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
  QCardTitle,
  QCardMain,
  QCardSeparator,
  QCardActions,
  QCardMedia,
  QBtn,
  QTooltip,
  QIcon,
  QChip,
} from 'quasar'
import Markdown from '@/utils/components/Markdown'
import RandomArt from '@/utils/components/RandomArt'

export default {
  components: {
    Markdown,
    RandomArt,
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QCardActions,
    QCardMedia,
    QBtn,
    QTooltip,
    QIcon,
    QChip,
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
      getMyApplicationInGroup: 'groupApplications/getMineInGroup',
    }),
    cardStyle () {
      const reduceOpacity = this.group.isInactive && !this.group.isMember
      if (reduceOpacity) {
        return { opacity: 0.5 }
      }
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
  .smaller-text >>> *
    font-size 1em
  .photo
    height 160px
    img
      max-height 100%
      max-width 100%
      width auto
      margin 0 auto

  .fixed-height:before {
    content ''
    width 100%
    height 100%
    position absolute
    left 0
    top 0
    background linear-gradient(transparent 220px, white);
  }
</style>
