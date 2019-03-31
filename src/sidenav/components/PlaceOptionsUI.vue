<template>
  <QPopover
    fit
  >
    <QList
      v-close-overlay
      item-separator
      link
    >
      <QItem :to="{name: 'placeEdit', params: { placeId }}">
        <QIcon
          size="1em"
          name="fas fa-fw fa-pencil-alt on-left"
        />
        {{ $t('STOREDETAIL.EDIT') }}
      </QItem>
      <QItem :to="{name: 'placePickupsManage', params: { placeId }}">
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
    placeId: { default: null, type: Number },
  },
}
</script>

<style scoped lang="stylus">
</style>
