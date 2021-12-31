<template>
  <Markdown
    :users="users"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>
<script>
import Markdown from '@/utils/components/Markdown'
import { mapGetters } from 'vuex'

export default {
  components: { Markdown },
  computed: {
    ...mapGetters({
      users: 'users/byCurrentGroup',
    }),
  },
}
</script>
