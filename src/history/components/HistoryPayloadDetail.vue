<template>
  <QItem
    v-if="label === 'collectors'"
    dense
  >
    <QItemMain>
      <QItemTile label>
        <RouterLink
          v-for="user in value"
          :key="user"
          style="margin-right: .4em"
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
        {{ $d(new Date(Array.isArray(value) ? value[0] : value), 'long') }}
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
import {
  QItem,
  QItemMain,
  QItemTile,
} from 'quasar'
export default {
  components: {
    QItem,
    QItemMain,
    QItemTile,
  },
  props: {
    label: {
      required: true,
      type: String,
    },
    value: {
      type: [String, Date, Number],
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
