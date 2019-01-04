<template>
  <QPopover
    fit
  >
    <QList
      item-separator
      link
      v-close-overlay
    >
      <QItem :to="{name: 'storeEdit', params: { storeId }}">
        <QIcon
          size="1em"
          name="fas fa-fw fa-pencil-alt on-left"
        />
        {{ $t('STOREDETAIL.EDIT') }}
      </QItem>
      <QItem :to="{name: 'storePickupsManage', params: { storeId }}">
        <QIcon
          size="1em"
          name="fas fa-fw fa-calendar-alt on-left"
        />
        {{ $t('STOREDETAIL.MANAGE') }}
      </QItem>
    </QList>
  </QPopover>
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
