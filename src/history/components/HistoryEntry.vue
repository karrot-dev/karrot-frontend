<template>
  <div>
    <QItem
      class="clickable"
      clickable
      :class="{'greyed': detailIsShown}"
      @click="toggleDetail"
    >
      <QItemSection avatar>
        <HistoryProfilePictures
          :users="users"
        />
      </QItemSection>
      <QItemSection>
        <QItemLabel>
          <span
            v-measure
            class="content"
          >
            {{ description }}
          </span>
        </QItemLabel>
        <QItemLabel
          stamp
          class="mobile-only text-weight-light"
        >
          <DateAsWords :date="entry.date" />
        </QItemLabel>
      </QItemSection>
      <QItemSection
        class="desktop-only"
        side
      >
        <DateAsWords :date="entry.date" />
      </QItemSection>
    </QItem>
    <Transition name="slide-toggle">
      <div
        v-if="detailIsShown"
        class="detail-wrapper greyed"
        style="cursor: pointer"
        @click.self="toggleDetail"
      >
        <HistoryDetail
          style="cursor: initial"
          :entry="entry"
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import {
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'
import { computed, toRefs } from 'vue'

import { useHistoryHelpers } from '@/history/helpers'
import { useUserService } from '@/users/services'

import HistoryDetail from '@/history/components/HistoryDetail.vue'
import HistoryProfilePictures from '@/history/components/HistoryProfilePictures.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'

export default {
  components: {
    HistoryProfilePictures,
    HistoryDetail,
    DateAsWords,
    QItem,
    QItemSection,
    QItemLabel,
  },
  props: {
    entry: {
      required: true,
      type: Object,
    },
  },
  setup (props) {
    const { entry } = toRefs(props)
    const { getUserById } = useUserService()

    const {
      getHistoryDescription,
    } = useHistoryHelpers()

    const users = computed(() => entry.value?.users.map(getUserById) ?? [])
    const description = computed(() => getHistoryDescription(entry.value))

    return {
      users,
      description,
    }
  },
  data () {
    return {
      detailIsShown: false,
    }
  },
  methods: {
    toggleDetail () {
      if (this.detailIsShown) {
        window.history.replaceState(window.history.state, null, `#${this.$route.path}`)
      }
      else {
        window.history.replaceState(window.history.state, null, this.$router.resolve({ name: 'historyDetail', params: { historyId: this.entry.id } }).href)
      }
      this.detailIsShown = !this.detailIsShown
    },
  },
}
</script>
<style scoped lang="sass">
.slide-toggle-enter-active,
.slide-toggle-leave-active
  overflow: hidden
  transition: max-height .2s

.slide-toggle-enter-active
  max-height: 1000px

.slide-toggle-enter,
.slide-toggle-leave-active
  max-height: 0

.slide-toggle-leave
  max-height: 1000px

.clickable
  transition: padding .5s ease

  &:hover
    background-color: rgb(235, 235, 235)

.clickable.greyed
  padding: 1em 3em 10px 3em

.greyed
  background-color: rgb(235, 235, 235)

.detail-wrapper
  padding: 0 2em
  padding-bottom: 2em
</style>
