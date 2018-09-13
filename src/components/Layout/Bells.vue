<template>
  <component
    :is="asPage ? 'q-card' : 'div'"
    class="bg-white"
  >
    <q-list no-border>
      <div
        v-if="asPopover"
        class="row justify-end q-mb-sm q-mr-sm"
      >
        <q-btn
          v-close-overlay
          size="sm"
          color="secondary"
          :to="{ name: 'bells' }"
        >
          {{ $t('BUTTON.SHOW_MORE') }}
        </q-btn>
      </div>
      <q-item
        v-if="bells.length === 0"
      >
        {{ $t('BELLS.NO_BELLS') }}
      </q-item>
      <BellItem
        v-for="bell in bells"
        :key="bell.id"
        :bell="bell"
        @open="open"
      />
      <q-item
        v-if="!asPopover && canFetchPast"
        class="row justify-center"
      >
        <q-btn
          size="sm"
          :loading="fetchingPast"
          @click="fetchPast"
        >
          {{ $t('BUTTON.SHOW_MORE') }}
        </q-btn>
      </q-item>
    </q-list>
  </component>
</template>

<script>
import {
  QCard,
  QList,
  QListHeader,
  QItemSeparator,
  QItem,
  QBtn,
} from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import BellItem from './BellItem'

export default {
  components: {
    QCard,
    QList,
    QListHeader,
    QItemSeparator,
    QItem,
    QBtn,
    BellItem,
  },
  props: {
    asPage: {
      type: Boolean,
      default: false,
    },
    asPopover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      bells: 'bells/current',
      canFetchPast: 'bells/canFetchPast',
      fetchingPast: 'bells/fetchingPast',
    }),
  },
  methods: {
    ...mapActions({
      fetchPastConversations: 'bells/fetchPast',
    }),
    open () {
      console.log('do something!')
    },
  },
}
</script>
