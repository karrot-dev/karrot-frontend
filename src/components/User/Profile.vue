<template>
  <div class="k-profile">
    <q-alert
      v-if="!currentGroupMembership && currentGroup"
      type="warning"
    >
      {{ $t('SWITCHGROUP.NOT_MEMBER', { userName: user.displayName, groupName: currentGroup.name }) }}
    </q-alert>
    <div
      class="row justify-end"
      style="margin-bottom: -32px"
    >
      <SwitchGroupButton
        :user="user"
        :groups="user.groups"
        @selectGroup="$emit('selectGroup', arguments[0])"
      />
    </div>
    <div class="photoAndName row no-wrap ellipsis">
      <transition
        duration="510"
        name="turn-in"
        appear
      >
        <div class="photo q-pa-sm q-ma-md bg-white shadow-4">
          <ProfilePicture
            :is-link="false"
            :user="user"
            :size="profilePictureSize"
          />
        </div>
      </transition>
      <div
        style="overflow: hidden"
        class="self-center"
      >
        <h1 class="name accent-font">
          {{ user.displayName }}
        </h1>
      </div>
    </div>
    <q-card
      v-if="!isInfoOnly"
      class="profile-info relative-position q-pt-sm"
    >
      <div
        class="user-actions"
      >
        <q-btn
          v-if="user.isCurrentUser"
          icon="fas fa-pencil-alt"
          small
          round
          color="secondary"
          :to="{ name: 'settings' }"
        />
        <q-btn
          v-if="!user.isCurrentUser"
          small
          round
          color="secondary"
          icon="fas fa-comments"
          @click="$emit('detail', user)"
        />
        <TrustButton
          v-if="currentGroupMembership"
          :user="user"
          :group="currentGroup"
          :membership="currentGroupMembership"
          @createTrust="$emit('createTrust', arguments[0])"
        />
      </div>
      <q-list>
        <q-item>
          <q-item-side icon="fas fa-fw fa-envelope" />
          <q-item-main class="ellipsis">
            <a :href='"mailto:" + user.email'>{{ user.email }}</a>
          </q-item-main>
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
      <q-card-media v-if="$q.platform.is.mobile && user.latitude && user.longitude">
        <UserMapPreview
          :user="user"
          style="height: 100px"
        />
      </q-card-media>
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
import TrustButton from '@/components/User/TrustButton'
import SwitchGroupButton from '@/components/User/SwitchGroupButton'

import {
  QAlert,
  QCard,
  QCardActions,
  QCardMain,
  QCardMedia,
  QBtn,
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QItemTile,
  QChip,
} from 'quasar'

export default {
  components: {
    Markdown,
    UserMapPreview,
    ProfilePicture,
    TrustButton,
    SwitchGroupButton,
    QAlert,
    QCard,
    QCardActions,
    QCardMain,
    QCardMedia,
    QBtn,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    QChip,
  },
  props: {
    user: { required: true, type: Object },
    currentGroup: { default: null, type: Object },
  },
  computed: {
    profilePictureSize () {
      if (this.$q.platform.is.mobile) {
        return 80
      }
      return 180
    },
    currentGroupMembership () {
      return this.user.membership
    },
    isInfoOnly () {
      return !this.user.email
    },
  },
}
</script>

<style scoped lang="stylus">
body.desktop .k-profile
  .photoAndName
    margin-left 26px
    margin-top 20px
    margin-bottom 20px
  .name
    padding-left 18px

.k-profile
  .photoAndName
    margin-left 10px
    margin-top 14px
    margin-bottom 14px
  .name
    padding-left 6px
  .photo
    transform rotate(-3deg)
  .user-actions
    position absolute
    top -24px
    right 10px

.turn-in-enter
  transform rotate(-15deg)

.turn-in-leave-active, .turn-in-enter-active
  transition: all .5s ease

.turn-in-enter-to
  transform rotate(-3deg)
</style>
