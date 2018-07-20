<template>
  <div>
    <img :src="loginImage">
    <h4>
      {{ $t('APPLICATION_FORM.TITLE', { groupName: group.name }) }}
    </h4>
  </div>
</template>

<script>
import loginImage from 'assets/people/cherry.png'
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
