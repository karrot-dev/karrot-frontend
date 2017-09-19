<template>
  <div class="wrapper">
    <q-search separator class="lightgrey" v-model="terms" placeholder="Search">
      <q-autocomplete @search="search" @selected="selected" />
    </q-search>
  </div>
</template>

<script>
import { QSearch, QAutocomplete } from 'quasar'

export default {
  components: { QSearch, QAutocomplete },
  data () {
    return {
      terms: null,
    }
  },
  props: {
    stores: { required: true },
    groups: { required: false },
    users: { required: false },
  },
  methods: {
    search (terms, done) {
      let res = []

      let storeRes = this.stores.filter((store) => { return store.name.toLowerCase().match(terms.toLowerCase()) })
      res.push(...storeRes.map((el) => {
        return {
          value: {name: 'store', params: {groupId: el.groupId, storeId: el.id}},
          label: el.name,
          icon: 'fa-shopping-cart',
        }
      }))

      if (this.groups) {
        let groupRes = this.groups.filter((group) => { return group.name.toLowerCase().match(terms.toLowerCase()) })
        res.push(...groupRes.map((el) => {
          return {
            value: {name: 'group', params: {groupId: el.id}},
            label: el.name,
            icon: 'fa-home',
          }
        }))
      }

      if (this.users) {
        let userRes = this.users.filter((user) => { return user.displayName.toLowerCase().match(terms.toLowerCase()) })
        res.push(...userRes.map((el) => {
          return {
            value: {name: 'user', params: {userId: el.id}},
            label: el.displayName,
            icon: 'fa-user',
          }
        }))
      }
      done(res)
    },
    selected (item) {
      this.terms = item.label
      this.$emit('done')
      this.$router.push(item.value)
    },
  },
}
</script>

<style scoped lang="stylus">
.lightgrey
  background-color lightgrey
</style>