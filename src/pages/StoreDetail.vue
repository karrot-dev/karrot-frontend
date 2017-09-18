<template>
  <Layout>
    <div slot="sidenav-desktop">
      <SidenavMap :stores="stores" :users="users"/>
    </div>
    <div>
      <h5>Store Detail</h5>
      <div style="width: 100%">aasdas dasd asd asdlöaj dlkjasd lfjhasd flkajshdifuha skljdfl ashdlf k jasduhf alksdfn  akjsdn alöksjd ölajsd ölkajs öldkjasdölkj</div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout/MainLayout.vue'
import StoreList from '@/components/Store/StoreList.vue'
import SidenavMap from '@/components/Sidenav/SidenavMap.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    StoreList,
    SidenavMap,
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
