<template>
  <q-list item-separator link>
    <q-item @click="doSomething(), $refs.popover.close()">
      <q-icon size="1em" name="fa-pencil fa-fw" />
      Edit Group
    </q-item>
    <q-item @click="doSomething(), $refs.popover.close()">              
      <q-icon size="1em" name="fa-user-plus fa-fw" />
      Invite someone
    </q-item>
    <q-item @click="doSomething(), $refs.popover.close()">
      <q-icon size="1em" name="fa-info-circle fa-fw" />
      Show public group info
    </q-item>
    <q-item @click="doSomething(), $refs.popover.close()">
      <q-icon size="1em" name="fa-sign-out fa-fw" />
      Leave Group
    </q-item>
  </q-list>
</template>

<script>
import { QList, QItem, QIcon } from 'quasar'

export default {
  components: {
    QList, QItem, QIcon
  }
}
</script>

<style scoped lang="stylus">
</style>