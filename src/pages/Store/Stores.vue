<template>
  <StoreList :stores="stores"/>
</template>

<script>
import StoreList from '@/components/Store/StoreList.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    StoreList,
  },
  computed: {
    ...mapGetters({
      stores: 'stores/list',
    }),
  },
  metaInfo () {
    return {
      title: this.$t('GROUP.STORES'),
    }
  },
}
</script>

<style scoped lang="stylus">
</style>
