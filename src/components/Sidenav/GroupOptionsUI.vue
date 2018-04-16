<template>
  <q-popover
    fit
    anchor="bottom right"
    self="top right"
  >
    <q-list
      item-separator
      link
      v-close-overlay
    >
      <q-item
        v-if="$q.platform.is.mobile"
        :to="{name: 'groupMembers', params: {groupId: currentGroupId}}"
      >
        <q-icon
          size="1em"
          name="fas fa-users fa-fw on-left"
        />
        {{ $t('GROUP.MEMBERS') }}
      </q-item>
      <q-item
        v-if="$q.platform.is.mobile"
        :to="{name: 'groupSettings', params: {groupId: currentGroupId}}"
      >
        <q-icon
          size="1em"
          name="fas fa-cog fa-fw on-left"
        />
        {{ $t('GROUP.SETTINGS') }}
      </q-item>
      <q-item
        :to="{name: 'groupEdit', params: {groupId: currentGroupId}}"
      >
        <q-icon
          size="1em"
          name="fas fa-pencil-alt fa-fw on-left"
        />
        {{ $t('GROUP.EDIT') }}
      </q-item>

      <q-item
        v-if="isAgreementManager"
        :to="{name: 'groupManageAgreement', params: {groupId: currentGroupId}}"
      >
        <q-icon
          size="1em"
          name="fas fa-file-text-alt fa-fw on-left"
        />
        {{ $t('GROUP.MANAGE_AGREEMENT') }}
      </q-item>

      <q-item
        v-if="$q.platform.is.desktop"
        :to="{name: 'groupPreview', params: {groupPreviewId: currentGroupId}}"
      >
        <q-icon
          size="1em"
          name="fas fa-info-circle fa-fw on-left"
        />
        {{ $t('GROUPINFO.META') }}
      </q-item>

      <q-item
        v-if="$q.platform.is.desktop"
        :to="{name: 'groupInvitations', params: {groupId: currentGroupId}}"
      >
        <q-icon
          size="1em"
          name="fas fa-user-plus fa-fw on-left"
        />
        {{ $t('GROUP.INVITE_TITLE') }}
      </q-item>

      <q-item @click.native="leave">
        <q-icon
          size="1em"
          name="fas fa-sign-out-alt fa-fw on-left"
        />
        {{ $t('GROUP.LEAVE') }}
      </q-item>
    </q-list>
  </q-popover>
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
