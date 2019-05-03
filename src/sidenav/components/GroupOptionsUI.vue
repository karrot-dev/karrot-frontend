<template>
  <QPopover
    fit
    anchor="bottom right"
    self="top right"
  >
    <QList
      v-close-overlay
      item-separator
      link
    >
      <QItem
        v-if="isEditor"
        :to="{name: 'groupEdit', params: {groupId: currentGroupId}}"
      >
        <QIcon
          size="1em"
          name="fas fa-pencil-alt fa-fw on-left"
        />
        {{ $t('GROUP.EDIT') }}
      </QItem>

      <QItem
        v-if="isAgreementManager"
        :to="{name: 'groupManageAgreement', params: {groupId: currentGroupId}}"
      >
        <QIcon
          size="1em"
          name="fas fa-file-alt fa-fw on-left"
        />
        {{ $t('GROUP.MANAGE_AGREEMENT') }}
      </QItem>

      <QItem
        :to="{name: 'groupPreview', params: {groupPreviewId: currentGroupId}}"
      >
        <QIcon
          size="1em"
          name="fas fa-info-circle fa-fw on-left"
        />
        {{ $t('GROUPINFO.META') }}
      </QItem>

      <QItem
        v-if="isEditor"
        :to="{name: 'groupInvitations', params: {groupId: currentGroupId}}"
      >
        <QIcon
          size="1em"
          name="fas fa-user-plus fa-fw on-left"
        />
        {{ $t('GROUP.INVITE_TITLE') }}
      </QItem>

      <QItem @click.native="leave">
        <QIcon
          size="1em"
          name="fas fa-sign-out-alt fa-fw on-left"
        />
        {{ $t('GROUP.LEAVE') }}
      </QItem>
    </QList>
  </QPopover>
</template>

<script>
import { QList, QItem, QIcon, QPopover, Dialog } from 'quasar'
export default {
  components: {
    QList, QItem, QIcon, QPopover,
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
  },
  methods: {
    leave () {
      Dialog.create({
        title: this.$t('GROUP.LEAVE'),
        message: this.$t('GROUP.LEAVE_TEXT'),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.YES'),
      })
        .then(() => this.$emit('leave', this.currentGroupId))
        .catch(() => {})
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
