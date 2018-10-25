<template>
  <div v-if="group">
    <img :src="loginImage">
    <h4>
      {{ $t('APPLICATION.FORM_TITLE', { groupName: group.name }) }}
    </h4>
  </div>
</template>

<script>
import loginImage from 'authuser/assets/cherry.png'
import { mapGetters } from 'vuex'

export default {
  components: { },
  data () {
    return {
      loginImage,
    }
  },
  computed: {
    ...mapGetters({
      group: 'groups/activePreview',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
