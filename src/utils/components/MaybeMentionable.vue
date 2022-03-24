<template>
  <div v-if="disable">
    <slot />
  </div>
  <Mentionable
    v-else
    :keys="['@']"
    :items="mentionItems"
    :insert-space="true"
    placement="bottom-end"
    offset="6"
    v-bind="$attrs"
  >
    <slot />
    <!-- don't show anything when no result -->
    <template #no-result>
      &nbsp;
    </template>
    <template #item="{ item: { mentionUser } }">
      <QItem>
        <QItemSection avatar>
          <ProfilePicture
            :user="mentionUser"
            :size="30"
            :is-link="false"
            class="profilePic"
          />
        </QItemSection>
        <QItemSection>
          <QItemLabel>
            {{ mentionUser.displayName }}
          </QItemLabel>
          <QItemLabel caption>
            @{{ mentionUser.username }}
          </QItemLabel>
        </QItemSection>
      </QItem>
    </template>
  </Mentionable>
</template>

<script>
import { mapGetters } from 'vuex'
import { Mentionable } from 'vue-mention'
import { QItem, QItemLabel, QItemSection } from 'quasar'

// for vue-mention
import 'floating-vue/dist/style.css'

import ProfilePicture from '@/users/components/ProfilePicture'

export default {
  name: 'MaybeMentionable',
  components: {
    QItem,
    QItemSection,
    QItemLabel,
    ProfilePicture,
    Mentionable,
  },
  props: {
    disable: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    mentionItems () {
      return this.users.map(user => {
        return {
          mentionUser: user,
          value: user.username,
          searchText: [user.displayName, user.username].join(' '),
        }
      })
    },
    // TODO: consider if we keep this, or pass it down with props
    ...mapGetters({
      users: 'users/byCurrentGroup',
    }),
  },
}
</script>

<style lang="sass">
// TODO: why not scoped?
.popover
  // Ensure we appear over everything else
  z-index: 999999999 !important
  border: 1px solid $grey-3

.mention-item
  background-color: white

.mention-selected
  cursor: pointer
  background: $grey-3
</style>
