<template>
  <q-card>
    <q-card-title class="overflow-ellipsis">
      {{ group.name }}
      <span slot="subtitle">
        {{ group.members.length }} Members
      </span>
    </q-card-title>
    <q-card-main class="fixed-height">
      {{ group.publicDescription.slice(0, 150) }}
      <span v-if="group.publicDescription == ''" class="text-italic">
        {{ $t("JOINGROUP.NO_PUBLIC_DESCRIPTION") }}
      </span>
    </q-card-main>
    <q-card-separator />
    <q-card-actions>
      <q-btn v-if="joinable" @click="join" class="q-btn-flat">
        {{ $t("BUTTON.JOIN") }}
      </q-btn>
      <q-btn v-if="visitable" @click="visit" class="q-btn-flat">
        {{ $t("VISIT") }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn } from 'quasar'

export default {
  props: {
    group: {
      required: true,
    },
    joinable: {},
    visitable: {},
  },
  components: { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn },
  methods: {
    join (event) {
      this.$emit('join')
    },
    visit (event) {
      this.$emit('visit')
    },
  },
}
</script>

<style scoped lang="stylus">
.q-card > *
  overflow: hidden
.fixed-height
  min-height: 60px
  max-height: 60px
</style>
