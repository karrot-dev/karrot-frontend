<template>
  <q-popover
    fit
    ref="popover"
  >
    <q-list
      item-separator
      link
    >
      <q-item :to="{name: 'storeEdit', params: { storeId }}">
        <q-icon
          size="1em"
          name="fa-pencil fa-fw on-left"
        />
        {{ $t('STOREDETAIL.EDIT') }}
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
    storeId: { required: true },
  },
}
</script>

<style scoped lang="stylus">
</style>
