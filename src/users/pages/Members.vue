<template>
  <QCard class="no-mobile-margin no-shadow grey-border k-members">
    <div class="relative-position">
      <RandomArt
        :seed="groupId"
        type="circles"
      />
      <div class="q-mx-md actionButtons">
        <QBtn
          small
          round
          color="secondary"
          :icon="sorting === 'joinDate' ? 'fas fa-sort-alpha-down' : 'fas fa-sort-numeric-down'"
          :title="$t(sorting === 'joinDate' ? 'GROUP.SORT_NAME' : 'GROUP.SORT_JOINDATE')"
          @click="toggleSorting"
        />
        <QBtn
          small
          round
          color="secondary"
          icon="fas fa-user-plus"
          :title="$t('GROUP.INVITE_TITLE')"
          @click="inviteLink = true"
        />

        <QDialog v-model="inviteLink">
          <QCard>
            <QCardSection>
              <div class="text-h6">
                Invitation link
              </div>
            </QCardSection>
            <QCardSection>
              <div>
                Copy the link and send it to the person you want to invite.
              </div>
            </QCardSection>
            <QCardSection class="q-py-md">
              <QField filled>
                <template #append>
                  <QBtn
                    flat
                    rounded
                    icon="fas fa-copy"
                    @click="copyLink"
                  >
                    <q-tooltip
                      anchor="top middle"
                      self="bottom middle"
                    >
                      Click to copy
                    </q-tooltip>
                  </QBtn>
                </template>
                <template #control>
                  <div class="self-center full-width no-outline">
                    {{ linkToCopy }}
                  </div>
                </template>
              </QField>
            </QCardSection>
            <QCardSection align="right">
              <QBtn
                v-close-popup
                flat
                :label="$t('BUTTON.CLOSE')"
              />
            </QCardSection>
          </QCard>
        </QDialog>
      </div>
    </div>

    <KSpinner v-show="fetchStatus.pending" />
    <UserList
      class="q-pt-md"
      :users="users"
      :group="group"
      :sorting="sorting"
      @create-trust="createTrust"
    />
  </QCard>
</template>

<script>
import {
  copyToClipboard,
  QCard,
  QCardSection,
  QDialog,
  QField,
  QBtn,
} from 'quasar'
import UserList from '@/users/components/UserList'
import RandomArt from '@/utils/components/RandomArt'
import KSpinner from '@/utils/components/KSpinner'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: {
    RandomArt,
    UserList,
    KSpinner,
    QCard,
    QCardSection,
    QDialog,
    QField,
    QBtn,
  },
  data () {
    return {
      sorting: 'joinDate',
      inviteLink: false,
    }
  },
  computed: {
    ...mapGetters({
      users: 'users/byCurrentGroup',
      group: 'currentGroup/value',
      isEditor: 'currentGroup/isEditor',
      fetchStatus: 'users/fetchStatus',
    }),
    groupId () {
      return this.group && this.group.id
    },
    linkToCopy () {
      return window.location.protocol + '//' + window.location.host + '/#/groupPreview/' + this.group.id
    },
  },
  methods: {
    ...mapActions({
      createTrust: 'currentGroup/trustUser',
    }),
    toggleSorting () {
      if (this.sorting === 'joinDate') {
        this.sorting = 'name'
      }
      else {
        this.sorting = 'joinDate'
      }
    },
    copyLink () {
      return copyToClipboard(this.linkToCopy)
    },
  },
}
</script>

<style scoped lang="stylus">
.k-members
  max-width 500px
  margin-right auto
  margin-left auto

.actionButtons
  position absolute
  right 5px
  bottom -20px

  .q-btn
    margin-left 3px
</style>
