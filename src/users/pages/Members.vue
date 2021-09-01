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
          @click="inviteDialog = true"
        />

        <CustomDialog v-model="inviteDialog">
          <template #title>
            {{ $t('GROUP.INVITATION_DIALOG.TITLE') }}
          </template>
          <template #message>
            <p>{{ $t('GROUP.INVITATION_DIALOG.MESSAGE') }}</p>

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
                    {{ $t('URL_CLICK_TO_COPY') }}
                  </q-tooltip>
                </QBtn>
              </template>
              <template #control>
                <div
                  class="self-center full-width no-outline"
                  style="word-break: break-word; overflow-wrap: break-word;"
                >
                  {{ linkToCopy }}
                </div>
              </template>
            </QField>
          </template>
          <template #actions>
            <QBtn
              v-close-popup
              flat
              color="primary"
              autofocus
              :label="$t('BUTTON.CLOSE')"
            />
          </template>
        </CustomDialog>
      </div>
    </div>

    <KSpinner v-show="fetchStatus.pending" />
    <UserList
      class="q-pt-md"
      :users="users"
      :group="group"
      :sorting="sorting"
      @create-trust="createTrust"
      @revoke-trust="revokeTrust"
    />
  </QCard>
</template>

<script>
import {
  copyToClipboard,
  QCard,
  QField,
  QBtn,
} from 'quasar'
import CustomDialog from '@/utils/components/CustomDialog'
import UserList from '@/users/components/UserList'
import RandomArt from '@/utils/components/RandomArt'
import KSpinner from '@/utils/components/KSpinner'
import { absoluteURL } from '@/utils/absoluteURL'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: {
    RandomArt,
    UserList,
    KSpinner,
    CustomDialog,
    QCard,
    QField,
    QBtn,
  },
  data () {
    return {
      sorting: 'joinDate',
      inviteDialog: false,
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
      return absoluteURL('/#/groupPreview/' + this.group.id)
    },
  },
  methods: {
    ...mapActions({
      createTrust: 'currentGroup/trustUser',
      revokeTrust: 'currentGroup/revokeTrust',
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
      return copyToClipboard(this.linkToCopy).then(() => {
        this.$store.dispatch('toasts/show', {
          message: 'URL_COPIED_TOAST',
        }, { root: true })
      })
    },
  },
}
</script>

<style scoped lang="sass">
.k-members
  max-width: 500px
  margin-right: auto
  margin-left: auto

.actionButtons
  position: absolute
  right: 5px
  bottom: -20px

  .q-btn
    margin-left: 3px
</style>
