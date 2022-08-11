<template>
  <QBtn
    v-if="groups.length > 1 || (groups.length > 0 && !currentGroup)"
    color="primary"
    @click="showModal = true"
  >
    <i
      class="fas fa-hand-pointer on-left"
    />
    {{ currentGroup ? currentGroup.name : $t('TOPBAR.CHANGE_GROUP') }}
    <QDialog
      v-model="showModal"
    >
      <QList
        class="bg-white"
        dense
      >
        <QItemLabel
          header
          class="text-weight-medium"
        >
          {{ getIsCurrentUser(user) ? $t('JOINGROUP.MY_GROUPS') : $t('SWITCHGROUP.COMMON_GROUPS') }}
        </QItemLabel>
        <QItem
          v-for="group in commonGroups"
          :key="group.id"
          v-close-popup
          clickable
          @click="selectGroup(group.id)"
        >
          <QItemSection>
            {{ group.name }}
          </QItemSection>
          <QItemSection
            v-if="getIsCurrentGroup(group)"
            side
          >
            <QIcon
              name="fas fa-star"
              color="secondary"
              size="1.1em"
            />
          </QItemSection>
        </QItem>
        <QItemLabel
          v-if="otherGroups.length > 0"
          header
          class="text-weight-medium"
        >
          {{ $t('SWITCHGROUP.OTHER_GROUPS') }}
        </QItemLabel>
        <QItem
          v-for="group in otherGroups"
          :key="group.id"
          :to="{ name: 'groupPreview', params: { groupPreviewId: group.id } }"
        >
          <QItemSection>
            {{ group.name }}
          </QItemSection>
        </QItem>
      </QList>
    </QDialog>
  </QBtn>
</template>

<script setup>
import { toRefs, computed, ref } from 'vue'
import {
  QBtn,
  QList,
  QItemLabel,
  QItem,
  QItemSection,
  QDialog,
  QIcon,
} from 'quasar'
import { useGroupHelpers } from '@/group/helpers'
import { useAuthHelpers } from '@/authuser/helpers'
import { useCurrentGroupService } from '@/group/services'

const props = defineProps({
  groups: {
    default: () => [],
    type: Array,
  },
  user: {
    default: null,
    type: Object,
  },
})

const { groups } = toRefs(props)

const showModal = ref(false)

const { getIsCurrentGroup } = useGroupHelpers()
const { getIsCurrentUser } = useAuthHelpers()
const { selectGroup } = useCurrentGroupService()

const currentGroup = computed(() => groups.value.find(group => getIsCurrentGroup(group)))
const commonGroups = computed(() => groups.value.filter(group => group.isMember))
const otherGroups = computed(() => groups.value.filter(group => !group.isMember))

</script>
