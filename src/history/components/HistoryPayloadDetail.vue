<template>
  <QItem
    v-if="label === 'collectors'"
    dense
  >
    <QItemSection>
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
    </QItemSection>
  </QItem>

  <QItem
    v-else-if="label === 'date'"
    dense
  >
    <QItemSection>
      <QItemLabel>
        {{ $d(new Date(Array.isArray(value) ? value[0] : value), 'long') }}
      </QItemLabel>
      <QItemLabel caption>
        {{ $t('CREATEPICKUP.DATE') }}
      </QItemLabel>
    </QItemSection>
  </QItem>

  <QItem
    v-else
    dense
  >
    <QItemSection>
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
    </QItemSection>
  </QItem>
</template>

<script>
import {
  QItem,
  QItemSection,
  QItemTile,
} from 'quasar'
export default {
  components: {
    QItem,
    QItemSection,
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
