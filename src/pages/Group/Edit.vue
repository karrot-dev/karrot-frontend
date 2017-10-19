<template>
  <div>
    <h3><i class="fa fa-edit"></i> {{ $t('GROUP.EDIT') }}</h3>
    <q-card>
      <GroupEdit :group="group" :status="status" @save="save"/>
    </q-card>
  </div>
</template>

<script>
import { QCard } from 'quasar'
import GroupEdit from '@/components/Group/GroupEdit'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Edit',
  components: { QCard, GroupEdit },
  computed: {
    ...mapGetters({
      group: 'groups/activeGroup',
      status: 'groups/status',
    }),
  },
  methods: {
    ...mapActions({
      save: 'groups/save',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
