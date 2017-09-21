<template>
  <q-card>
    <q-card-title>
      {{ group.name }}
      <span slot="subtitle">
        {{ group.members.length }} Members
      </span>
    </q-card-title>
    <q-card-main>
      <Markdown
        v-if="group.publicDescription != ''"
        class="quote"
        :source="group.publicDescription" />
      <span v-if="group.publicDescription == ''" class="text-italic">
        {{ $t("JOINGROUP.NO_PUBLIC_DESCRIPTION") }}
      </span>
    </q-card-main>
    <q-card-separator />
    <q-card-actions>
      <q-input v-if="group.protected && !group.isMember" v-model="password" />
      <q-btn v-if="!group.isMember" @click="$emit('join', { groupId: group.id, password })" class="q-btn-flat">
        {{ $t("BUTTON.JOIN") }}
      </q-btn>
      <q-btn v-if="group.isMember" @click="$emit('visit', { groupId: group.id })" class="q-btn-flat">
        {{ $t("VISIT") }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn, QInput } from 'quasar'
import Markdown from '@/components/Markdown.vue'

export default {
  data () {
    return { password: '' }
  },
  props: {
    group: {
      required: true,
    },
  },
  components: { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn, QInput, Markdown },
}
</script>

<style scoped lang="stylus">
</style>
