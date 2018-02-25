<template>
  <div>
    <q-alert
      v-if="!isLoggedIn"
      color="info"
      icon="star"
      class="alert"
    >
      <i18n path="JOINGROUP.LOGOUT_MESSAGE.LOGGED_OUT">
        <router-link
          place="login"
          :to="{ name: 'login' }"
          class="underline"
        >
          {{ $t('JOINGROUP.LOGOUT_MESSAGE.LOG_IN') }}
        </router-link>
      </i18n>
    </q-alert>
    <h4
      v-if="myGroups.length>0"
      class="text-primary"
    >
      {{ $t('JOINGROUP.MY_GROUPS') }}
    </h4>
    <div
      v-if="myGroups.length>0"
      class="row"
    >
      <div
        v-for="group in myGroups"
        :key="group.id"
        class="inline-block col-xs-12 col-sm-6 col-md-4 items-stretch">
        <GroupGalleryCard
          :class="{highlight: group.id === currentGroupId}"
          :group="group"
          :is-member="true"
          @preview="$emit('preview', { groupId: group.id })"
          @visit="$emit('visit', { groupId: group.id })"
        />
      </div>
    </div>
    <h4
      class="text-primary generic-padding"
      v-if="otherGroups.length>0"
    >
      {{ $t('JOINGROUP.WHICHGROUP') }}
    </h4>
    <q-card>
      <q-search
        class="searchbar"
        v-model="search"
      />
    </q-card>
    <transition-group
      name="list-complete"
      v-if="otherGroups.length>0"
      class="row">
      <div
        v-for="group in filteredGroups"
        :key="group.id"
        class="list-complete-item inline-block col-xs-12 col-sm-6 col-md-4 items-stretch"
      >
        <GroupGalleryCard
          :group="group"
          :is-member="false"
          @preview="$emit('preview', { groupId: group.id })"
        />
      </div>
    </transition-group>
  </div>
</template>

<script>
import GroupGalleryCard from './GroupGalleryCard'
import { QAlert, QSearch, QCard } from 'quasar'

export default {
  data () {
    return {
      search: '',
    }
  },
  props: {
    myGroups: {
      default: () => [],
      type: Array,
    },
    otherGroups: {
      required: true,
      type: Array,
    },
    isLoggedIn: {
      required: true,
      type: Boolean,
    },
    currentGroupId: {
      default: -1,
      type: Number,
    },
  },
  computed: {
    filteredGroups () {
      return this.otherGroups.filter(group => {
        return group.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
  },
  components: { GroupGalleryCard, QAlert, QSearch, QCard },
}
</script>

<style scoped lang="stylus">
@import '~variables'
body.desktop .alert
  margin 2em 8px 2.5em 8px
.text-primary
  margin-left .2em
.highlight
  border 2px solid $positive
.searchbar
  margin-top .2em
  vertical-align middle
  height 45px
  padding 5px
.underline
  text-decoration underline

.list-complete-item
  transition: all .5s
  display: inline-block

.list-complete-enter, .list-complete-leave-to
  opacity: 0
  transform: translateY(30px)

.list-complete-leave-active
  position: absolute
</style>
