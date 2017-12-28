<template>
  <div>
    <div class="row margin-sides no-wrap">
      <div class="">
        <q-transition
          duration="510"
          name="turn-in"
          appear
        >
          <div class="photoCard shadow-2">
            <ProfilePicture
              :user="user"
              :size="profilePictureSize"
            />
          </div>
        </q-transition>
      </div>
      <div style="overflow: hidden">
        <h1 class="accent-font">
          {{ user.displayName }}
        </h1>
        <p class="subtitle">
          <span
            v-for="(group, indx) in groups"
            :key="group.id"
          >
            <router-link :to="{name: 'group', params: { groupId: group.id }}">
              {{ group.name }}
            </router-link>
            <span v-if="groups.length !== indx + 1">,</span>
          </span>
        </p>
      </div>
    </div>
    <q-card class="generic-padding">
      <UserMapPreview
        v-if="user.latitude && user.longitude"
        :user="user"
        class="map"
      />
      <div class="info">
        <div
          class="info-item"
          style="word-break: break-all">
          <strong>
            <i class="fa fa-fw fa-envelope-o on-left" />
          </strong>
          {{ user.email }}
          <span v-if="user.email !== user.unverifiedEmail">
            <i class="fa fa-arrow-right"/>
            <router-link :to="{name: 'settings'}">
              {{ user.unverifiedEmail }}
            </router-link>
          </span>
        </div>
        <div
          class="info-item"
          v-if="user.address"
        >
          <strong class="info-item">
            <i class="fa fa-fw fa-map-marker on-left" />
          </strong>
          {{ user.address }}
        </div>
      </div>
      <q-card-separator v-if="user.description != ''"/><br>
      <Markdown
        v-if="user.description"
        :source="user.description"
      />
      <div style="clear: both; margin-bottom: 8px"/>
    </q-card>
  </div>
</template>

<script>

import Markdown from '@/components/Markdown'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import UserMapPreview from '@/components/Map/UserMapPreview'

import { QCard, QCardTitle, QTransition, QCardActions, QBtn, QCardSeparator } from 'quasar'

export default {
  components: { Markdown, UserMapPreview, QCard, QCardTitle, QTransition, QCardActions, QBtn, QCardSeparator, ProfilePicture },
  props: {
    user: { required: true },
    groups: { required: true },
  },
  computed: {
    profilePictureSize () {
      if (this.$q.platform.is.mobile) {
        return 60
      }
      return 90
    },
  },
}
</script>

<style scoped lang="stylus">
h1, p.subtitle
  padding-left 30px
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
  .info-item
    margin-bottom 8px

.turn-in-enter
  transform rotate(-15deg)

.turn-in-leave-active, .turn-in-enter-active
  transition: all .5s ease

.turn-in-enter-to
  transform rotate(-3deg)

</style>
