<template>
  <QList dense>
    <QItem
      v-for="{ label, icon, to, handler } in entries"
      :key="label"
      v-close-popup
      :to="to"
      clickable
      @click="handler && handler()"
    >
      <QItemSection
        side
        class="text-center"
      >
        <QIcon
          :name="icon"
          size="1.1em"
        />
      </QItemSection>
      <QItemSection>
        {{ label }}
      </QItemSection>
    </QItem>
  </QList>
</template>

<script>
import {
  QList,
  QItem,
  QItemSection,
  QIcon,
  Dialog,
} from 'quasar'
import { useLeaveGroupMutation } from '@/group/mutations'
export default {
  components: {
    QList,
    QItem,
    QItemSection,
    QIcon,
  },
  props: {
    currentGroupId: {
      default: null,
      type: Number,
    },
    roles: {
      default: () => [],
      type: Array,
    },
  },
  setup () {
    const { mutate: leaveGroup } = useLeaveGroupMutation()
    return {
      leaveGroup,
    }
  },
  computed: {
    isEditor () {
      return this.roles && this.roles.includes('editor')
    },
    entries () {
      return [{
        condition: this.isEditor,
        label: this.$t('GROUP.EDIT'),
        icon: 'fas fa-pencil-alt fa-fw',
        to: { name: 'groupEdit', params: { groupId: this.currentGroupId } },
      }, {
        label: this.$t('GROUP.LEAVE'),
        icon: 'fas fa-sign-out-alt fa-fw',
        handler: this.leave,
      }].filter(e => typeof e.condition === 'undefined' || e.condition === true)
    },
  },
  methods: {
    leave () {
      Dialog.create({
        title: this.$t('GROUP.LEAVE'),
        message: this.$t('GROUP.LEAVE_TEXT'),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.YES'),
      })
        .onOk(() => this.leaveGroup(this.currentGroupId))
    },
  },
}
</script>
