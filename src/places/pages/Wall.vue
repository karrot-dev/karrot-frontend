<template>
  <WallConversation
    class="q-pt-lg"
    :place-id="placeId"
  />
</template>

<script setup>
import { useActivePlaceService } from '@/places/services'

import WallConversation from '@/messages/components/WallConversation'

const { placeId } = useActivePlaceService()
</script>
