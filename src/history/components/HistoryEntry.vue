<template>
  <div>
    <QItem
      class="entry"
      clickable
      :active="open"
      active-class="open"
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
          <DateAsWords
            :date="entry.date"
            :future="false"
          />
        </QItemLabel>
      </QItemSection>
      <QItemSection
        class="desktop-only"
        side
      >
        <DateAsWords
          :date="entry.date"
          :future="false"
        />
      </QItemSection>
    </QItem>
    <div
      v-if="open"
      class="detail-wrapper greyed"
      style="cursor: pointer"
      @click.self="toggleDetail"
    >
      <HistoryDetail
        style="cursor: initial"
        :entry="entry"
      />
    </div>
  </div>
</template>

<script setup>
import {
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'
import { computed, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useHistoryHelpers } from '@/history/helpers'
import { useUserService } from '@/users/services'

import HistoryDetail from '@/history/components/HistoryDetail.vue'
import HistoryProfilePictures from '@/history/components/HistoryProfilePictures.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'

const props = defineProps({
  entry: {
    required: true,
    type: Object,
  },
})

const { entry } = toRefs(props)
const { getUserById } = useUserService()

const {
  getHistoryDescription,
} = useHistoryHelpers()

const users = computed(() => entry.value?.users.map(getUserById) ?? [])
const description = computed(() => getHistoryDescription(entry.value))

const open = ref(false)

const router = useRouter()
const route = useRoute()

function toggleDetail () {
  if (open.value) {
    window.history.replaceState(window.history.state, null, `#${route.path}`)
  }
  else {
    window.history.replaceState(window.history.state, null, router.resolve({ name: 'historyDetail', params: { historyId: entry.value.id } }).href)
  }
  open.value = !open.value
}
</script>
<style scoped lang="sass">
.entry
  border-radius: 12px
  //&.open
  //  border-bottom-left-radius: 0
  //  border-bottom-right-radius: 0
</style>
