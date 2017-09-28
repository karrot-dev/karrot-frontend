<template>
  <div>
    <q-alert
      v-if="!isLoggedIn"
      color="info"
      icon="star"
    >
      You are currently logged out. <router-link :to="{ name: 'login' }" class="text-primary">Log in</router-link> to see your groups!
    </q-alert>
    <h4 v-if="myGroups.length>0" class="text-primary">My groups</h4>
    <div v-if="myGroups.length>0" class="row">
      <div
        v-for="group in myGroups"
        :key="group.id"
        class="inline-block col-xs-12 col-sm-6 col-md-4 items-stretch">
        <GroupPreviewCard :class="{highlight: group.id == currentGroupId}" :group="group" :isMember="true" @preview="$emit('preview', { groupId: group.id })" @visit="$emit('visit', { groupId: group.id })" />
      </div>
    </div>
    <h4 class="text-primary" v-if="otherGroups.length>0">
      {{ $t('JOINGROUP.WHICHGROUP') }}
    </h4>
    <div class="row" v-if="otherGroups.length>0">
      <div
        v-for="group in otherGroups"
        :key="group.id"
        class="inline-block col-xs-12 col-sm-6 col-md-4 items-stretch">
        <GroupPreviewCard :group="group" :isMember="false" @preview="$emit('preview', { groupId: group.id })" />
      </div>
    </div>
  </div>
</template>

<script>
import GroupPreviewCard from './GroupPreviewCard.vue'
import { QAlert } from 'quasar'

export default {
  props: {
    myGroups: {
      default: () => [],
    },
    otherGroups: {
      required: true,
    },
    isLoggedIn: {},
    currentGroupId: {
      default: -1,
    },
  },
  components: { GroupPreviewCard, QAlert },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.text-primary
  margin-left .2em
.highlight
  border 2px solid $positive
</style>
