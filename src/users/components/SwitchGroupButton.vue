<template>
  <QBtn
    v-if="groups.length > 1 || (isLoaded && !currentGroup)"
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
          {{ user.isCurrentUser ? $t('JOINGROUP.MY_GROUPS') : $t('SWITCHGROUP.COMMON_GROUPS') }}
        </QItemLabel>
        <QItem
          v-for="group in commonGroups"
          :key="group.id"
          v-close-popup
          clickable
          @click="$emit('selectGroup', { groupId: group.id })"
        >
          <QItemSection>
            {{ group.name }}
          </QItemSection>
          <QItemSection
            v-if="group.isCurrentGroup"
            side
          >
            <QIcon
              :name="$icon('star')"
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

<script>
import {
  QBtn,
  QList,
  QItemLabel,
  QItem,
  QItemSection,
  QDialog,
  QIcon,
} from 'quasar'

export default {
  components: {
    QBtn,
    QList,
    QItemLabel,
    QItem,
    QItemSection,
    QDialog,
    QIcon,
  },
  props: {
    groups: {
      default: () => [],
      type: Array,
    },
    user: {
      default: null,
      type: Object,
    },
  },
  data () {
    return {
      showModal: false,
    }
  },
  computed: {
    isLoaded () {
      return this.groups.length > 0
    },
    currentGroup () {
      return this.groups.find(g => g.isCurrentGroup)
    },
    commonGroups () {
      return this.groups.filter(g => g.isMember)
    },
    otherGroups () {
      return this.groups.filter(g => !g.isMember)
    },
  },
}
</script>
