<template>
  <tr v-if="label === 'collectorIds' ">
    <td>{{ label }}</td>
    <td>
      <router-link style="margin-right: .4em" :key="user" v-for="user in value" :to="{name:'user', params: {userId: user}}">
        {{user}}
      </router-link>
    </td>
  </tr>
  <tr v-else-if="label === 'date' ">
    <td>{{ $t('CREATEPICKUP.DATE') }}</td>
    <td>{{ $d(new Date(value), 'long') }}</td>
  </tr>
  <tr v-else-if="label === 'description' ">
    <td>{{ $t('GROUP.DESCRIPTION') }}</td>
    <td>{{ value }}</td>
  </tr>
  <tr v-else>
    <td>{{ label }}</td>
    <td>{{ value }}</td>
  </tr>
</template>

<script>

export default {
  props: {
    label: {},
    value: {},
  },
}
</script>

<style scoped lang="stylus">
</style>
