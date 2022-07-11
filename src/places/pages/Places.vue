<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->



<template>
  <QCard>
    <PlaceList
      class="white-background"
      :group-id="groupId"
      :places="places"
      :archived="archived"
    />
  </QCard>
</template>

<script>
import PlaceList from '@/places/components/PlaceList'
import { mapGetters } from 'vuex'
import { QCard } from 'quasar'

export default {
  components: {
    PlaceList, QCard,
  },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
      places: 'places/byCurrentGroup',
      archived: 'places/byCurrentGroupArchived',
    }),
  },
}
</script>
