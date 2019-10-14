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
  computed: {
    isAgreementManager () {
      return this.roles && this.roles.includes('agreement_manager')
    },
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
        condition: this.isAgreementManager,
        label: this.$t('GROUP.MANAGE_AGREEMENT'),
        icon: 'fas fa-file-alt fa-fw',
        to: { name: 'groupManageAgreement', params: { groupId: this.currentGroupId } },
      }, {
        label: this.$t('GROUPINFO.META'),
        icon: this.$icon('info_circle_fw'),
        to: { name: 'groupPreview', params: { groupPreviewId: this.currentGroupId } },
      }, {
        condition: this.isEditor,
        label: this.$t('GROUP.INVITE_TITLE'),
        icon: 'fas fa-user-plus fa-fw',
        to: { name: 'groupInvitations', params: { groupId: this.currentGroupId } },
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
        .onOk(() => this.$emit('leave', this.currentGroupId))
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
