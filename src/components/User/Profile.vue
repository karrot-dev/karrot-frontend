<template>
  <div>
    <div class="row margin-sides no-wrap">
      <div>
        <transition
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
        </transition>
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
              {{ group.name }}<!--
            --></router-link><!--
            --><span v-if="groups.length !== indx + 1">,</span>
          </span>
        </p>
      </div>
    </div>
    <q-card class="profile-info">
      <q-card-media v-if="$q.platform.is.mobile && user.latitude && user.longitude">
        <UserMapPreview
          :user="user"
          style="height: 100px"
        />
      </q-card-media>
      <UserMapPreview
        v-if="!$q.platform.is.mobile && user.latitude && user.longitude"
        :user="user"
        class="map float-right"
      />
      <q-list :dense="$q.platform.is.mobile">
        <q-item style="height: 40px">
          <q-item-side icon="fas fa-fw fa-envelope" />
          <q-item-main style="overflow: hidden; text-overflow: ellipsis">
            <a :href='"mailto:" + user.email'>{{ user.email }}</a>
          </q-item-main>
          <q-item-side
            v-if="user.isCurrentUser"
            right
          >
            <q-btn
              icon="fas fa-pencil-alt"
              small
              round
              color="secondary"
              :to="{ name: 'settings' }"
            />
          </q-item-side>
          <q-item-side
            v-else
            right
          >
            <q-btn
              small
              round
              color="tertiary"
              icon="fas fa-comments"
              class="hoverScale"
              @click="$emit('detail', user)"
            />
          </q-item-side>
        </q-item>

        <q-item v-if="user.mobileNumber">
          <q-item-side icon="fas fa-fw fa-phone" />
          <q-item-main>
            {{ user.mobileNumber }}
          </q-item-main>
        </q-item>

        <q-item v-if="user.address">
          <q-item-side icon="fas fa-fw fa-map-marker-alt" />
          <q-item-main>
            {{ user.address }}
          </q-item-main>
        </q-item>
      </q-list>
      <q-card-separator v-if="user.description !== ''" />
      <q-card-main>
        <Markdown
          v-if="user.description"
          :source="user.description"
        />
      </q-card-main>
    </q-card>
  </div>
</template>

<script>

import Markdown from '@/components/Markdown'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import UserMapPreview from '@/components/Map/UserMapPreview'

import { QCard, QCardTitle, QCardActions, QCardMain, QCardMedia, QBtn, QCardSeparator, QList, QItem, QItemMain, QItemSide } from 'quasar'

export default {
  components: { Markdown, UserMapPreview, QCard, QCardMain, QCardTitle, QCardMedia, QCardActions, QBtn, QCardSeparator, QList, QItem, QItemMain, QItemSide, ProfilePicture },
  props: {
    user: { required: true, type: Object },
    groups: { required: true, type: Array },
  },
  computed: {
    profilePictureSize () {
      if (this.$q.platform.is.mobile) {
        return 60
      }
      return 180
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
  max-width: 40%
  margin 10px 10px 2px 2px
body.desktop .profile-info
  min-height 220px
.q-card-separator
  margin 0px 16px
body.mobile
  .map
    height 150px
    width 150px
  .q-item
    padding 2px 6px
  .q-card-separator
    margin 0px 10px

.turn-in-enter
  transform rotate(-15deg)

.turn-in-leave-active, .turn-in-enter-active
  transition: all .5s ease

.turn-in-enter-to
  transform rotate(-3deg)

</style>
