<template>
  <Layout>
    <q-list>
      <q-collapsible :label="$t('SETTINGS.LANGUAGE')">
        <q-item>
          <q-item-side>
            <i class="fa fa-language"/>
          </q-item-side>
          <q-item-main>{{$t('SETTINGS.LANGUAGE')}}</q-item-main>
        </q-item>
      </q-collapsible>
      <q-item>
        <q-item-side>
          <i class="fa fa-user"/>
        </q-item-side>
        <q-item-main>Profile Info</q-item-main>
      </q-item>
    </q-list>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout/MainLayout.vue'
import { QList, QItem, QItemSide, QItemMain, QCollapsible } from 'quasar'

export default {
  components: { Layout, QList, QItem, QItemSide, QItemMain, QCollapsible },
  metaInfo () {
    return {
      title: this.$t('SETTINGS.TITLE'),
    }
  },
}
</script>

<style scoped lang="stylus">
</style>
