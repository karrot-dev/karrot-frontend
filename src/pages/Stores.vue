<template>
  <Layout>
    <h5>Stores</h5>
    <StoreList :stores="stores"/>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout/MainLayout.vue'
import StoreList from '@/components/Store/StoreList.vue'
import SidenavStores from '@/components/Sidenav/SidenavStores.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    StoreList,
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
      title: this.$t('LOGIN.TITLE'),
    }
  },
}
</script>

<style scoped lang="stylus">
</style>
