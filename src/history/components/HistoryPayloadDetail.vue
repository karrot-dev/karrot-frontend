<template>
  <QItem
    v-if="label === 'collectorIds'"
    dense
  >
    <QItemMain>
      <QItemTile label>
        <RouterLink
          style="margin-right: .4em"
          :key="user"
          v-for="user in value"
          :to="{name:'user', params: {userId: user}}"
        >
          {{ user }}
        </RouterLink>
      </QItemTile>
      <QItemTile sublabel>
        {{ label }}
      </QItemTile>
    </QItemMain>
  </QItem>

  <QItem
    v-else-if="label === 'date'"
    dense
  >
    <QItemMain>
      <QItemTile label>
        {{ $d(new Date(value), 'long') }}
      </QItemTile>
      <QItemTile sublabel>
        {{ $t('CREATEPICKUP.DATE') }}
      </QItemTile>
    </QItemMain>
  </QItem>

  <QItem
    v-else
    dense
  >
    <QItemMain>
      <QItemTile
        v-if="value"
        label
      >
        {{ value }}
      </QItemTile>
      <QItemTile
        v-else
        color="grey"
        icon="fas fa-question-circle"
        label
      />
      <QItemTile sublabel>
        {{ convertedLabel }}
      </QItemTile>
    </QItemMain>
  </QItem>
</template>

<script>
import { QItem, QItemMain, QItemSide, QItemTile } from 'quasar'
export default {
  components: { QItem, QItemMain, QItemSide, QItemTile },
  props: {
    label: {
      required: true,
      type: String,
    },
    value: {
      type: String | Date | Number,
      required: true,
    },
  },
  computed: {
    convertedLabel () {
      if (this.label === 'description') return this.$t('GROUP.DESCRIPTION')
      return this.label
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
