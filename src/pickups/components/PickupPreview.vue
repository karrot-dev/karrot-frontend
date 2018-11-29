<template>
  <div class="edit-box">
    <q-list>
      <q-list-header class="row justify-between no-wrap">
        <span>Changing this recurring pickup will have these effects:</span>
        <span>Collectors</span>
      </q-list-header>
      <q-item
        v-for="{existingPickup, newDate, key, toCreate, toDelete, isException, isTheSame} in enriched"
        :key="key"
      >
        <q-item-side>
          <q-icon
            v-if="toDelete"
            class="text-negative"
            name="fas fa-fw fa-trash-alt"
          />
          <q-icon
            v-else-if="toCreate"
            class="text-secondary"
            name="fas fa-fw fa-plus-circle"
          />
        </q-item-side>
        <q-item-main>
          <q-item-tile
            label
          >
            <template v-if="toDelete">
              {{ $d(existingPickup.date, 'dateAndTime') }}
            </template>
            <template v-else-if="toCreate">
              {{ $d(newDate, 'dateAndTime') }}
            </template>
            <span v-else-if="isException">
              <s>{{ $d(newDate, 'dateAndTime') }}</s>
            </span>
            <span v-else-if="isTheSame">
              {{ $d(newDate, 'dateAndTime') }}
            </span>
          </q-item-tile>
        </q-item-main>
        <q-item-side
          v-if="existingPickup"
          right
        >
          <ProfilePicture
            v-for="user in existingPickup.collectors"
            :key="user.id"
            :user="user"
          />
        </q-item-side>
      </q-item>
    </q-list>
    <q-item>
      <q-item-main>
        <q-item-tile
          sublabel
          class="group row"
          style="font-size: 80%"
        >
          <div class="q-ml-none">Legend:</div>
          <div>
            <q-icon
              class="text-negative"
              name="fas fa-fw fa-trash-alt"
            /> to cancel
          </div>
          <div>
            <q-icon
              class="text-secondary"
              name="fas fa-fw fa-plus-circle"
            /> to create
          </div>
          <s>previously deleted</s>
        </q-item-tile>
      </q-item-main>
    </q-item>
    <p class="q-mt-lg">You can enter a message to tell your group about this change:</p>
    <MarkdownInput :value="message">
      <q-input
        v-model="message"
        type="textarea"
        rows="3"
        @keyup.ctrl.enter="$emit('save', message)"
      />
    </MarkdownInput>
    <div class="actionButtons">
      <q-btn
        color="primary"
        @click="$emit('save', message)"
      >
        Confirm
      </q-btn>
    </div>
  </div>
</template>

<script>
import ProfilePicture from '@/users/components/ProfilePicture'
import MarkdownInput from '@/utils/components/MarkdownInput'
import {
  QList,
  QItem,
  QItemMain,
  QItemTile,
  QItemSide,
  QIcon,
  QListHeader,
  QBtn,
  QInput,
} from 'quasar'

export default {
  components: {
    ProfilePicture,
    MarkdownInput,
    QList,
    QItem,
    QItemMain,
    QItemTile,
    QItemSide,
    QIcon,
    QListHeader,
    QBtn,
    QInput,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      message: '',
    }
  },
  computed: {
    enriched () {
      if (!this.value) return
      return this.value.map(({ existingPickup, newDate }) => ({
        existingPickup: this.$store.getters['pickups/enrich'](existingPickup),
        newDate,
        key: ((existingPickup && existingPickup.date) || newDate).toISOString(),
        toCreate: !existingPickup && newDate,
        toDelete: existingPickup && !newDate,
        isException: existingPickup && existingPickup.deleted && newDate,
        isTheSame: existingPickup && !existingPickup.deleted && newDate,
      }))
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
