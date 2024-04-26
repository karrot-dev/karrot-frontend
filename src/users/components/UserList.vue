<template>
  <div class="list-wrapper">
    <QList>
      <QItem
        v-if="users.length > 1"
        v-t="{ path: 'GROUP.MEMBERLIST', args: { total: users.length } }"
        class="text-caption"
      />
      <QItem
        v-if="users.length > 15"
      >
        <QInput
          v-model="filterTerm"
          :placeholder="$t('BUTTON.SEARCH')"
          :debounce="300"
          class="full-width"
        >
          <template #prepend>
            <QIcon name="search" />
          </template>
        </QInput>
      </QItem>
      <QInfiniteScroll
        :disable="activeEntriesLimit >= activeEntries.length"
        @load="loadMoreActiveEntries"
      >
        <UserItem
          v-for="entry in limitedActiveEntries"
          :key="entry.key"
          :user="entry.user"
          :membership="entry.membership"
          :added-by="entry.addedBy"
        />
      </QInfiniteScroll>
      <KSpinner v-if="activeEntriesLimit < activeEntries.length" />
      <template v-if="inactiveEntries.length > 0">
        <QSeparator />
        <QExpansionItem
          @show="showInactive = true"
          @hide="showInactive = false"
        >
          <template #header>
            <QItemSection side>
              <QIcon
                name="fas fa-bed"
                class="q-mr-xs"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel>
                {{ $t('GROUP.INACTIVE') }}
              </QItemLabel>
              <QItemLabel caption>
                {{ inactiveSublabel }}
              </QItemLabel>
            </QItemSection>
            <QItemSection side>
              <QBtn
                flat
                round
                dense
                icon="help_outline"
                @click.stop="inactivityInfo"
              />
            </QItemSection>
          </template>

          <template v-if="showInactive">
            <UserItem
              v-for="entry in inactiveEntries"
              :key="entry.key"
              :user="entry.user"
              :membership="entry.membership"
              :added-by="entry.addedBy"
              class="inactive"
            />
          </template>
        </QExpansionItem>
      </template>
    </QList>
  </div>
</template>

<script>
import {
  Dialog,
  QList,
  QSeparator,
  QItem,
  QItemSection,
  QItemLabel,
  QExpansionItem,
  QBtn,
  QInput,
  QIcon,
  QInfiniteScroll,
} from 'quasar'
import { computed, toRefs } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { useUserService } from '@/users/services'

import KSpinner from '@/utils/components/KSpinner.vue'

import UserItem from './UserItem.vue'

export default {
  components: {
    UserItem,
    QList,
    QSeparator,
    QItem,
    QItemSection,
    QItemLabel,
    QExpansionItem,
    QBtn,
    QInput,
    QIcon,
    QInfiniteScroll,
    KSpinner,
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
    sorting: {
      type: String,
      default: 'joinDate',
    },
  },
  setup (props) {
    const { users } = toRefs(props)

    const {
      group,
      getMembership,
    } = useCurrentGroupService()

    const {
      getUserById,
    } = useUserService()

    const entries = computed(() => {
      return users.value.map(user => {
        const membership = getMembership(user.id)
        return {
          key: user.id,
          user,
          search: user.displayName.toLowerCase(),
          membership,
          addedBy: membership.addedBy && getUserById(membership.addedBy),
        }
      })
    })

    return {
      entries,
      group,
      getMembership,
    }
  },
  data () {
    return {
      activeEntriesLimit: 20,
      showInactive: false,
      filterTerm: '',
    }
  },
  computed: {
    inactiveSublabel () {
      return this.inactiveEntries.length + ' ' + this.$tc('JOINGROUP.NUM_MEMBERS', this.inactiveEntries.length)
    },
    activeEntries () {
      return this.sort(this.filterByTerms(this.entries.filter(entry => entry.membership.active)))
    },
    limitedActiveEntries () {
      return this.activeEntries.slice(0, this.activeEntriesLimit)
    },
    inactiveEntries () {
      return this.sort(this.filterByTerms(this.entries.filter(entry => !entry.membership.active)))
    },
  },
  methods: {
    loadMoreActiveEntries (index, done) {
      this.activeEntriesLimit += 20
      done(this.activeEntriesLimit >= this.activeEntries.length)
    },
    sort (list) {
      const sortByJoinDate = (a, b) => b.membership.createdAt - a.membership.createdAt
      const sortByName = (a, b) => a.user.displayName.localeCompare(b.user.displayName)
      return list.slice().sort(this.sorting === 'joinDate' ? sortByJoinDate : sortByName)
    },
    filterByTerms (list) {
      if (!this.filterTerm || this.filterTerm === '') return list
      const filterTermLower = this.filterTerm.toLowerCase()
      return list.filter(entry => entry.search.includes(filterTermLower))
    },
    inactivityInfo () {
      Dialog.create({
        title: this.$t('INACTIVITY.WHAT'),
        message: this.$t('INACTIVITY.HELP', { dayCount: this.group.memberInactiveAfterDays }),
        ok: this.$t('BUTTON.CLOSE'),
      })
    },
  },
}
</script>

<style scoped lang="sass">
.list-wrapper
  .profilePic
    margin-right: .5em

.inactive
  opacity: 0.5
</style>
