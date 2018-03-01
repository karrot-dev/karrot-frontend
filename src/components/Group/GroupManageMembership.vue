<template>
  <q-card>
    <q-card-main>
      <h3><i class="fa fa-edit" /> {{ $t('GROUP.MANAGE_MEMBERSHIP') }}</h3>
      <div class="list-wrapper">
        <q-list
          highlight
          no-border
        >
          <q-collapsible
            v-for="user in users"
            :key="user.id"
            :label="user.displayName"
          >
            <q-item
              v-for="t in togglesFor(user)"
              :key="t.value"
            >
              <q-toggle
                :label="t.label"
                v-model="t.checked"
                @input="$emit('save', { user, role: t.value, action: t.checked ? 'add' : 'delete' })"
              />
            </q-item>
          </q-collapsible>
        </q-list>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>

import { QCollapsible, QToggle, QCard, QCardMain, QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide } from 'quasar'

export default {
  components: { QCollapsible, QToggle, QCard, QCardMain, QList, QListHeader, QItem, QItemMain, QItemTile, QItemSide },
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  methods: {
    togglesFor (user) {
      const roles = [
        { label: 'Membership Manager', value: 'membership_manager' },
        { label: 'Agreement Manager', value: 'agreement_manager' },
      ]
      return roles.map(r => ({
        ...r,
        checked: user.rolesInGroup.includes(r.value),
      }))
    },
  },
}
</script>

<style scoped lang="stylus">
.list-wrapper
  margin .3em
  .profilePic
    margin-right .5em
</style>
