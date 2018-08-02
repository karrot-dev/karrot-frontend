<template>
  <div class="inline-block">
    <q-card
      class="groupPreviewCard"
      :color="cardColor"
      :class="{highlight: group.isCurrentGroup}"
      :style="cardStyle"
      @click.native="$emit(group.isMember ? 'visit' : 'preview')"
    >
      <q-card-title class="ellipsis">
        {{ group.name }}
        <span slot="subtitle">
          {{ group.members.length }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.members.length) }}
        </span>
      </q-card-title>
      <q-card-main class="fixed-height smaller-text">
        <div
          v-if="group.publicDescription"
        >
          <Markdown :source="group.publicDescription.slice(0, 150)" />
        </div>
        <span
          v-else
          class="text-italic"
        >
          {{ $t('JOINGROUP.NO_PUBLIC_DESCRIPTION') }}
        </span>
      </q-card-main>
      <q-card-separator />
      <q-card-actions v-if="group.isMember">
        <q-btn
          @click.stop="$emit('visit')"
          class="q-btn-flat"
        >
          <q-icon name="fas fa-home" />
          <q-tooltip>
            {{ $t('GROUPINFO.MEMBER_VIEW') }}
          </q-tooltip>
        </q-btn>
        <q-btn
          @click.stop="$emit('preview')"
          class="q-btn-flat"
        >
          <q-icon name="fas fa-info-circle" />
          <q-tooltip>
            {{ $t('GROUPINFO.META') }}
          </q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn, QTooltip, QIcon } from 'quasar'
import Markdown from '@/components/Markdown'

export default {
  components: { Markdown, QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn, QTooltip, QIcon },
  props: {
    group: {
      type: Object,
      default: () => ({
        members: [],
      }),
    },
  },
  computed: {
    cardColor () {
      return this.group.isPlayground ? 'secondary' : (this.group.hasMyApplication ? 'negative' : undefined)
    },
    cardStyle () {
      const reduceOpacity = this.group.isInactive && !this.group.isMember
      if (reduceOpacity) {
        return { opacity: 0.5 }
      }
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
  .fixed-height
    min-height 60px
    max-height 60px
  .smaller-text >>> *
    font-size 1em
</style>

<style lang="stylus">

</style>
