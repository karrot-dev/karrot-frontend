<template>
  <QItem
    v-if="label === 'participants'"
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
  >
    <QItemSection>
      <QItemLabel
        v-if="value"
      >
        {{ value }}
      </QItemLabel>
      <QItemLabel
        v-else
        color="grey"
        icon="fas fa-question-circle"
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
  QItemLabel,
} from 'quasar'
export default {
  components: {
    QItem,
    QItemSection,
    QItemLabel,
  },
  props: {
    label: {
      required: true,
      type: String,
    },
    value: {
      type: [Array, String, Date, Number],
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
