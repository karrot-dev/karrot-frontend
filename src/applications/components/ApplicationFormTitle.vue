<template>
  <div v-if="group">
    <img src="@/authuser/assets/cherry.png">
    <h4>
      {{ $t('APPLICATION.FORM_TITLE', { groupName: group.name }) }}
    </h4>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      group: 'groups/activePreview',
    }),
  },
}
</script>
