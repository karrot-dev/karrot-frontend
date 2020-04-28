<template>
  <QBtn
    flat
    v-if="!$q.platform.is.mobile"
    class="logo"
    @click="onMainClick"
  >
    <div class="logo">
      <slot />
      <QImg
        v-if="currentGroup && currentGroup.hasPhoto"
        :src="currentGroup.photoUrls.thumbnail"
      />
      <KarrotLogo
        v-else
        show-loading
      />
    </div>
    <QMenu>
      <QList>
        <QItem
          v-close-popup
          clickable
          @click="onItemClick"
        >
          <QItemSection>
            <pre>
              {{ myGroups }}
            </pre>
          </QItemSection>
        </QItem>
      </QList>
    </QMenu>
  </QBtn>
</template>

<script>
import {
  QBtn,
  QImg,
  QMenu,
  QList,
  QItem,
  QItemSection,
  // QIcon,
} from 'quasar'
import KarrotLogo from '@/logo/components/KarrotLogo'

export default {
  components: {
    KarrotLogo,
    QBtn,
    QImg,
    QMenu,
    QList,
    QItem,
    QItemSection,
    // QIcon,
  },
  props: {
    currentGroup: {
      default: null,
      type: Object,
    },
    myGroups: {
      default: null,
      type: Array,
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.logo
  height 36px

.q-btn >>> .q-icon
  font-size 20px
</style>
