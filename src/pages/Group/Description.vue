<template>
  <div>
    <q-card class="no-shadow generic-padding grey-border" style="width: 100%">
      <vue-markdown
        v-if="group.publicDescription != ''"
        :anchorAttributes="{ target: '_blank', rel: 'nofollow noopener noreferrer' }"
        :source="group.publicDescription" />
    </q-card>
  </div>
</template>

<script>
import { QCard } from 'quasar'
import VueMarkdown from 'vue-markdown'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { QCard, VueMarkdown },
  computed: {
    ...mapGetters({
      group: 'groups/activeGroup',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
