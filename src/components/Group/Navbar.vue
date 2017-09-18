<template>
    <q-tabs color="secondary" class="mobile-only" hide="icon" slot="navigation">
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
}
</script>

<style scoped lang="stylus">
</style>