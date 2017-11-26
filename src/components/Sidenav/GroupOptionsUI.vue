<template>
  <q-popover fit ref="popover">
    <q-list item-separator link>
      <q-item :to="{name: 'groupEdit', params: {groupId: currentGroupId}}" @click.native="$refs.popover.close()">
        <q-icon size="1em" name="fa-pencil fa-fw on-left" />
        {{ $t('GROUP.EDIT') }}
      </q-item>
      <q-item v-if="isAgreementManager" :to="{name: 'groupManageAgreement', params: {groupId: currentGroupId}}" @click.native="$refs.popover.close()">
        <q-icon size="1em" name="fa-file-text-o fa-fw on-left" />
        {{ $t('GROUP.MANAGE_AGREEMENT') }}
      </q-item>
      <q-item :to="{name: 'groupPreview', params: {groupPreviewId: currentGroupId}}" @click.native="$refs.popover.close()">
        <q-icon size="1em" name="fa-info-circle fa-fw on-left" />
        {{ $t('GROUPINFO.META') }}
      </q-item>
      <q-item :to="{name: 'groupInvitations', params: {groupId: currentGroupId}}" @click.native="$refs.popover.close()">
        <q-icon size="1em" name="fa-user-plus fa-fw on-left" />
        {{ $t('GROUP.INVITE_TITLE') }}
      </q-item>
      <q-item @click="leave">
        <q-icon size="1em" name="fa-sign-out fa-fw on-left" />
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
    currentGroupId: {required: true},
    roles: { type: Array, required: true },
  },
  computed: {
    isAgreementManager () {
      return this.roles && this.roles.includes('agreement_manager')
    },
  },
  methods: {
    leave () {
      this.$refs.popover.close()
      Dialog.create({
        title: this.$t('GROUP.LEAVE'),
        message: this.$t('GROUP.LEAVE_TEXT'),
        buttons: [
          this.$t('BUTTON.CANCEL'),
          {
            label: this.$t('BUTTON.YES'),
            handler: () => {
              this.$emit('leave', this.currentGroupId)
            },
          },
        ],
      })
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
