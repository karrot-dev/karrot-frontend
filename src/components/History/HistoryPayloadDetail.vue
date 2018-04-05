<template>
  <q-item
    v-if="label === 'collectorIds'"
    dense
  >
    <q-item-main>
      <q-item-tile label>
        <router-link
          style="margin-right: .4em"
          :key="user"
          v-for="user in value"
          :to="{name:'user', params: {userId: user}}"
        >
          {{ user }}
        </router-link>
      </q-item-tile>
      <q-item-tile sublabel>
        {{ label }}
      </q-item-tile>
    </q-item-main>
  </q-item>

  <q-item
    v-else-if="label === 'date'"
    dense
  >
    <q-item-main>
      <q-item-tile label>
        {{ $d(new Date(value), 'long') }}
      </q-item-tile>
      <q-item-tile sublabel>
        {{ $t('CREATEPICKUP.DATE') }}
      </q-item-tile>
    </q-item-main>
  </q-item>

  <q-item
    v-else
    dense
  >
    <q-item-main>
      <q-item-tile
        v-if="value"
        label
      >
        {{ value }}
      </q-item-tile>
      <q-item-tile
        v-else
        color="grey"
        icon="fa-question-circle"
        label
      />
      <q-item-tile sublabel>
        {{ convertedLabel }}
      </q-item-tile>
    </q-item-main>
  </q-item>
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
