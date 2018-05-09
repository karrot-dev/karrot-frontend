<template>
  <q-popover
    fit
  >
    <q-list
      item-separator
      link
      v-close-overlay
    >
      <q-item :to="{name: 'storeEdit', params: { storeId }}">
        <q-icon
          size="1em"
          name="fas fa-fw fa-pencil-alt on-left"
        />
        {{ $t('STOREDETAIL.EDIT') }}
      </q-item>
      <q-item :to="{name: 'storePickupsManage', params: { storeId }}">
        <q-icon
          size="1em"
          name="fas fa-fw fa-calendar-alt on-left"
        />
        {{ $t('STOREDETAIL.MANAGE') }}
      </q-item>
    </q-list>
  </q-popover>
</template>

<script>
import { QList, QItem, QIcon, QPopover } from 'quasar'

export default {
  components: {
    QList, QItem, QIcon, QPopover,
  },
  props: {
    storeId: { default: null, type: Number },
  },
}
</script>

<style scoped lang="stylus">
</style>
