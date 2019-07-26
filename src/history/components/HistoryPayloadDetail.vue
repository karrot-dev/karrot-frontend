<template>
  <QItem
    v-if="label === 'collectors'"
    dense
  >
    <QItemMain>
      <QItemLabel>
        <RouterLink
          v-for="user in value"
          :key="user"
          style="margin-right: .4em"
          :to="{name:'user', params: {userId: user}}"
        >
          {{ user }}
        </RouterLink>
      </QItemLabel>
      <QItemLabel caption>
        {{ label }}
      </QItemLabel>
    </QItemMain>
  </QItem>

  <QItem
    v-else-if="label === 'date'"
    dense
  >
    <QItemMain>
      <QItemLabel>
        {{ $d(new Date(Array.isArray(value) ? value[0] : value), 'long') }}
      </QItemLabel>
      <QItemLabel caption>
        {{ $t('CREATEPICKUP.DATE') }}
      </QItemLabel>
    </QItemMain>
  </QItem>

  <QItem
    v-else
    dense
  >
    <QItemMain>
      <QItemLabel
        v-if="value"
        header
      >
        {{ value }}
      </QItemLabel>
      <QItemLabel
        v-else
        color="grey"
        icon="fas fa-question-circle"
        header
      />
      <QItemLabel caption>
        {{ convertedLabel }}
      </QItemLabel>
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
