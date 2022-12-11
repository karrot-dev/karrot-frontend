<template>
  <QCard
    v-ripple
    class="notice bg-info q-hoverable cursor-pointer"
    @click="go"
  >
    <div class="q-pa-md">
      <i class="fas fa-star on-left" />
      {{ $t('ACTIVITYLIST.AVAILABLE') }}
    </div>
  </QCard>
</template>

<script setup>
import { QCard } from 'quasar'
import { useRouter } from 'vue-router'

import { useCurrentGroupService } from '@/group/services'

const { groupId } = useCurrentGroupService()
const router = useRouter()

function go () {
  router.push({ name: 'groupActivities', params: { groupId: groupId.value }, query: { place: 'subscribed', slots: 'free' } })
}

</script>

<style scoped lang="sass">
.notice
  color: $primary !important
  transition: all .2s ease

.notice:hover
  box-shadow: 1px 2px 2px 1px rgba(0, 0, 0, 0.4)

hr
  margin: 1em 2em
  border: solid lightgrey 1px
</style>
