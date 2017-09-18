<template>
  <q-card>
    <q-card-title>
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
      <q-btn v-if="isMember" @click="$emit('visit')" class="q-btn-flat">
        {{ $t("VISIT") }}
      </q-btn>
      <q-btn @click="$emit('preview')" class="q-btn-flat">
        {{ $t("PREVIEW") }}
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
    isMember: {
      required: true,
    },
  },
  components: { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn },
}
</script>

<style scoped lang="stylus">
.q-card > *
  overflow: hidden
.fixed-height
  min-height: 60px
  max-height: 60px
</style>
