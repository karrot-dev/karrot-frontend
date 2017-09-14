<template>
  <div>
    <h1>Home page!</h1>
    <div v-if="isFetching">Loading!</div>
    <div class="error" v-if="error">{{ error }}</div>
    <ul>
      <li v-for="group in groups">
        {{ group.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      groups: state => state.groups.entries,
      isFetching: state => state.groups.isFetching,
      error: state => state.groups.error
    })
  },
  methods: {
    ...mapActions(['fetchGroups'])
  },
  mounted () {
    this.fetchGroups()
  }
}
</script>

<style lang="stylus">
.error
  color: red
  font-weight: bold
</style>
