<template>
  <div v-if="group">
    <img :src="cherry">
    <h4>
      {{ $t('APPLICATION.FORM_TITLE', { groupName: group.name }) }}
    </h4>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cherry from '@/authuser/assets/cherry.png'

export default {
  computed: {
    ...mapGetters({
      group: 'groups/activePreview',
    }),
  },
  created () {
    this.cherry = cherry
  },
}
</script>
