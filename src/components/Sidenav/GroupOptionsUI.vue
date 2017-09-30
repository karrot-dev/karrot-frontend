<template>
  <q-list item-separator link>
    <q-item @click="doSomething(), $refs.popover.close()">
      <q-icon size="1em" name="fa-pencil fa-fw on-left" />
      {{$t("GROUP.EDIT")}}
    </q-item>
    <q-item :to="{name: 'groupInfo', params: {groupInfoId: activeGroupId}}" @click="$refs.popover.close()">
      <q-icon size="1em" name="fa-info-circle fa-fw on-left" />
      {{$t("GROUPINFO.META")}}
    </q-item>
    <q-item :to="{name: 'groupInvites', params: {groupId: activeGroupId}}" @click="$refs.popover.close()">
      <q-icon size="1em" name="fa-user-plus fa-fw on-left" />
      {{$t("GROUP.INVITE_TITLE")}}
    </q-item>
    <q-item @click="doSomething(), $refs.popover.close()">
      <q-icon size="1em" name="fa-sign-out fa-fw on-left" />
      {{$t("GROUP.LEAVE")}}
    </q-item>
  </q-list>
</template>

<script>
import { QList, QItem, QIcon } from 'quasar'

export default {
  components: {
    QList, QItem, QIcon,
  },
  props: {
    activeGroupId: {required: true},
  },
}
</script>

<style scoped lang="stylus">
</style>
