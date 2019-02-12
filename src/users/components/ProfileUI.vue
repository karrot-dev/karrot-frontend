<template>
  <div class="k-profile">
    <QAlert
      v-if="!currentGroupMembership && currentGroup"
      type="warning"
    >
      {{ $t('SWITCHGROUP.NOT_MEMBER', { userName: user.displayName, groupName: currentGroup.name }) }}
    </QAlert>
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
      <Transition
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
      </Transition>
      <div
        style="overflow: hidden"
        class="self-center"
      >
        <h1 class="name accent-font">
          {{ user.displayName }}
        </h1>
      </div>
    </div>
    <QCard
      v-if="!isInfoOnly"
      class="profile-info relative-position q-pt-sm"
    >
      <div
        class="user-actions"
      >
        <QBtn
          v-if="user.isCurrentUser"
          icon="fas fa-pencil-alt"
          small
          round
          color="secondary"
          :to="{ name: 'settings' }"
        />
        <QBtn
          v-if="!user.isCurrentUser"
          small
          round
          color="secondary"
          icon="fas fa-comments"
          @click="$emit('detail', user)"
        />
        <QBtn
          v-if="triggerCriteria"
          icon="fas fa-frown-open"
          small
          round
          color="negative"
          @click="$emit('report', {groupId: currentGroup.id, userId: user.id})"
        />
        <TrustButton
          v-if="currentGroupMembership"
          :user="user"
          :group="currentGroup"
          :membership="currentGroupMembership"
          @createTrust="$emit('createTrust', arguments[0])"
        />
      </div>
      <QList>
        <QItem>
          <QItemSide icon="fas fa-fw fa-envelope" />
          <QItemMain class="ellipsis">
            <a :href="mailto(user.email)">{{ user.email }}</a>
          </QItemMain>
        </QItem>

        <QItem v-if="user.mobileNumber">
          <QItemSide icon="fas fa-fw fa-phone" />
          <QItemMain>
            {{ user.mobileNumber }}
          </QItemMain>
        </QItem>

        <QItem v-if="user.address">
          <QItemSide icon="fas fa-fw fa-map-marker-alt" />
          <QItemMain>
            {{ user.address }}
          </QItemMain>
        </QItem>
      </QList>
      <QCardMedia v-if="$q.platform.is.mobile && user.latitude && user.longitude">
        <UserMapPreview
          :user="user"
          style="height: 100px"
        />
      </QCardMedia>
      <QCardMain>
        <Markdown
          v-if="user.description"
          :source="user.description"
        />
      </QCardMain>
    </QCard>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Markdown from '@/utils/components/Markdown'
import ProfilePicture from '@/users/components/ProfilePicture'
import UserMapPreview from '@/maps/components/UserMapPreview'
import TrustButton from '@/users/components/TrustButton'
import SwitchGroupButton from '@/users/components/SwitchGroupButton'

import {
  QAlert,
  QCard,
  QCardMain,
  QCardMedia,
  QBtn,
  QList,
  QItem,
  QItemMain,
  QItemSide,
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
    QCardMain,
    QCardMedia,
    QBtn,
    QList,
    QItem,
    QItemMain,
    QItemSide,
  },
  props: {
    user: { required: true, type: Object },
    currentGroup: { default: null, type: Object },
  },
  computed: {
    ...mapGetters({
      getIssues: 'issues/ongoing',
    }),
    conflictOngoing () {
      return this.getIssues.some(i => i.affectedUser.id === this.user.id)
    },
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
    // TODO: would be nice to say _why_ I can't create a conflict
    // TODO: does not check if I am an editor first, let's me write a message...
    triggerCriteria () {
      if (
        this.user.isCurrentUser ||
        !this.currentGroupMembership ||
        this.conflictOngoing ||
        (this.currentGroup.isOpen && !this.currentGroup.isPlayground) ||
        (this.currentGroup.activeEditorsCount < this.currentGroup.activeEditorsRequiredForConflictResolution)
      ) {
        return false
      }
      return true
    },
  },
  methods: {
    mailto (email) {
      return `mailto:${email}`
    },
  },
}
</script>

<style scoped lang="stylus">
body.desktop .k-profile
  .photoAndName
    margin-left 26px
    margin-bottom 20px
  .name
    padding-left 18px

.k-profile
  .photoAndName
    margin-left 10px
    margin-top 22px
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
