<template>
    <q-tabs v-if="shouldBeDisplayed" align="center" color="tertiary" class="mobile-only shadow-14 inset-shadow" hide="icon" slot="navigation">
        <q-route-tab
            :to="{name: 'group'}"
            exact
            slot="title"
            name="wall"
        >Wall</q-route-tab>
        <q-route-tab
            :to="{name: 'groupDescription'}"
            exact
            slot="title"
            name="description"
        >Description</q-route-tab>
        <q-route-tab
            :to="{name: 'groupHistory'}"
            exact
            slot="title"
            name="history"
        >History</q-route-tab>
    </q-tabs>
</template>

<script>
import { QTabs, QRouteTab } from 'quasar'

export default {
  components: { QTabs, QRouteTab },
  computed: {
    shouldBeDisplayed () {
      return this.$route.name === 'group' ||
        this.$route.name === 'groupDescription' ||
        this.$route.name === 'groupHistory'
    },
  },
}
</script>

<style scoped lang="stylus">
</style>