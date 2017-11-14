<template>
  <div>
    <h5 class="text-primary generic-padding" v-if="invitations.length > 0">
      {{ $t('GROUP.INVITED_LIST') }}
    </h5>
    <ul>
      <li v-for="invite in invitations" :key="invite.id">{{ invite.email }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    invitations: { required: true },
  },
}
</script>

<style scoped lang="stylus">
</style>
