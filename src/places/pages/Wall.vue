<template>
  <WallConversation
    class="q-pt-lg"
    :place-id="placeId"
  />
</template>

<script setup>
import WallConversation from '@/messages/components/WallConversation'
import { useActivePlaceService } from '@/places/services'

const { placeId } = useActivePlaceService()
</script>
