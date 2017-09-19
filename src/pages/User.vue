<template>
  <div>
    <div class="row margin-sides no-wrap">
      <div class="">
        <q-transition duration="510" name="turn-in" appear>
          <div class="photoCard shadow-2">
            <ProfilePicture :user="user" :size="profilePictureSize"/>
          </div>
        </q-transition>
      </div>
      <div>
        <h1 class="accent-font">{{user.displayName}}</h1>
        <p class="subtitle">Foodsaver in TODO</p>
      </div>
    </div>
    <q-card class="generic-padding">
      <p>{{user.description}}</p>
      <p>Statistics, Messages, Map</p>
      <q-card-separator />
      <hr color="lightgrey"/>
      <q-card-actions>
        <q-btn flat>Message</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex'

import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import { QCard, QTransition, QCardActions, QBtn, QCardSeperator } from 'quasar'

export default {
  components: { QCard, QTransition, QCardActions, QBtn, QCardSeperator, ProfilePicture },
  computed: {
    ...mapGetters({
      user: 'users/activeUser',
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
h1
  margin  0 0 0 0
p.subtitle
  margin .5em .5em .5em 0
.margin-sides
  margin 2em 2em 1em 2em
.photoCard
  margin-top .3em
  padding .5em
  background-color white
  transform rotate(-3deg)


.turn-in-enter
  transform rotate(-15deg)

.turn-in-leave-active, .turn-in-enter-active
  transition: all .5s ease

.turn-in-enter-to
  transform rotate(-3deg)

</style>
