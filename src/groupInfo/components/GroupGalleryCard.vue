<template>
  <div class="inline-block">
    <QCard
      class="groupPreviewCard relative-position"
      :class="{
        application: myApplicationPending,
      }"
      :style="cardStyle"
      @click="() => group.isMember ? visit() : preview()"
    >
      <QTooltip v-if="myApplicationPending">
        {{ $t('APPLICATION.GALLERY_TOOLTIP') }}
      </QTooltip>
      <div
        class="photo text-white relative-position row justify-center"
      >
        <QImg
          v-if="group.photoUrls?.fullSize"
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
                v-if="group.status === 'playground'"
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
      <QSeparator />
      <QCardActions
        v-if="myApplicationPending"
        class="bg-blue text-white"
      >
        <QBtn
          flat
          size="sm"
          icon="fas fa-info-circle"
          class="full-width"
          :label="$t('JOINGROUP.APPLICATION_PENDING')"
        />
      </QCardActions>
      <QCardActions v-else-if="group.isMember">
        <QBtn
          flat
          size="sm"
          icon="fas fa-home"
          @click.stop="visit"
        >
          <QTooltip>
            {{ $t('GROUPINFO.MEMBER_VIEW') }}
          </QTooltip>
        </QBtn>
        <QBtn
          flat
          size="sm"
          icon="fas fa-info-circle"
          @click.stop="preview"
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
} from 'quasar'
import { computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'

import { useApplicationHelpers } from '@/applications/helpers'
import { useGroupHelpers } from '@/group/helpers'

import Markdown from '@/utils/components/Markdown.vue'
import RandomArt from '@/utils/components/RandomArt.vue'

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
  },
  props: {
    group: {
      type: Object,
      default: () => ({
        members: [],
      }),
    },
  },
  setup (props) {
    const { group } = toRefs(props)
    const router = useRouter()
    const { getHasMyApplicationPending } = useApplicationHelpers()
    const { getIsCurrentGroup } = useGroupHelpers()

    function preview () {
      router.push({ name: 'groupPreview', params: { groupPreviewId: group.value.id } })
    }

    function visit () {
      router.push({ name: 'group', params: { groupId: group.value.id } })
    }

    return {
      myApplicationPending: computed(() => getHasMyApplicationPending(group.value.id)),
      isCurrentGroup: computed(() => getIsCurrentGroup(group)),
      preview,
      visit,
    }
  },
  computed: {
    cardStyle () {
      const reduceOpacity = this.group.status === 'inactive' && !this.group.isMember
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
