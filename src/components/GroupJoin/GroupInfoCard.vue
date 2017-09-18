<template>
  <q-card>
    <q-card-title>
      {{ group.name }}
      <span slot="subtitle">
        {{ group.members.length }} Members
      </span>
    </q-card-title>
    <q-card-main>
      <vue-markdown
        v-if="group.publicDescription != ''"
        class="quote"
        :anchorAttributes="{ target: '_blank', rel: 'nofollow noopener noreferrer' }"
        :source="group.publicDescription" />
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
import VueMarkdown from 'vue-markdown'

export default {
  props: {
    group: {
      required: true,
    },
    joinable: {},
    visitable: {},
  },
  components: { QCard, QCardTitle, QCardMain, QCardSeparator, QCardActions, QBtn, VueMarkdown },
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
</style>
