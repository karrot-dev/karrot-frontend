<template>
  <div v-if="user">
    <div class="row margin-sides no-wrap">
      <div class="">
        <q-transition duration="510" name="turn-in" appear>
          <div class="photoCard shadow-2">
            <ProfilePicture :user="user" :size="profilePictureSize"/>
          </div>
        </q-transition>
      </div>
      <div style="overflow: hidden">
        <h1 class="accent-font">{{user.displayName}}</h1>
        <p class="subtitle">
          <span v-for="(group, indx) in groups" :key="group.id">
            {{ group.name }}<span v-if="groups.length !== indx + 1">,</span>
          </span>
        </p>
      </div>
    </div>
    <q-card class="generic-padding">
      <GroupMap class="map"></GroupMap>
      <div class="info"> 
        <strong><i class="fa fa-fw fa-envelope-o on-left"></i> </strong>
        {{ user.email }}
        <span v-if="user.email !== user.unverifiedEmail">
          <i class="fa fa-arrow-right"/>
          <router-link :to="{name: 'settings'}">{{ user.unverifiedEmail }}</router-link>
        </span>
      </div>
      <q-card-separator /><br/>
      <vue-markdown
        v-if="user.description != ''"
        :anchorAttributes="{ target: '_blank', rel: 'nofollow noopener noreferrer' }"
        :source="user.description" />
      <q-card-separator />
      <q-card-actions>
        <q-btn flat>
          <i class="fa fa-comment on-left"/>
          Message
      </q-btn>
      </q-card-actions>
      <div style="clear: both"/>
    </q-card>

    <q-card color="info" class="generic-padding">
      <i class="fa fa-exclamation-triangle on-left"/>
      To be added: Statistics, working Messages, working Map, Email, Translation
    </q-card>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex'

import VueMarkdown from 'vue-markdown'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import GroupMap from '@/components/Map/GroupMap'

import { QCard, QTransition, QCardActions, QBtn, QCardSeparator } from 'quasar'

export default {
  components: { VueMarkdown, GroupMap, QCard, QTransition, QCardActions, QBtn, QCardSeparator, ProfilePicture },
  computed: {
    ...mapGetters({
      user: 'users/activeUser',
      groups: 'groups/getByActiveUser',
    }),
    profilePictureSize () {
      if (this.$q.platform.is.mobile) {
        return 60
      }
      return 90
    },
  },
  metaInfo () {
    if (this.user) {
      return {
        title: this.user.displayName,
      }
    }
    else {
      return {}
    }
  },
}
</script>

<style scoped lang="stylus">
h1, p.subtitle
  padding-left 50px
  margin 0
p.subtitle
  margin .5em .5em .5em 0
  text-overflow ellipsis
  overflow hidden
  width 100%
.margin-sides
  margin 2em 2em 1em 2em
.photoCard
  margin-top .3em
  padding .5em
  background-color white
  transform rotate(-3deg)
.map
  height 200px
  width 200px
  float right

body.mobile .map
  height 150px
  width 150px
.info
  margin-bottom 1em

.turn-in-enter
  transform rotate(-15deg)

.turn-in-leave-active, .turn-in-enter-active
  transition: all .5s ease

.turn-in-enter-to
  transform rotate(-3deg)

</style>
