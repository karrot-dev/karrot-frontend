<template>
  <Layout>
    <h5>Username...</h5>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout/MainLayout.vue'
import SidenavStores from '@/components/Sidenav/SidenavStores.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    SidenavStores,
    Layout,
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
