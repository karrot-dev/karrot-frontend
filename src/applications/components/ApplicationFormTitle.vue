<template>
  <div v-if="group">
    <img :src="cherry">
    <h4>
      {{ $t('APPLICATION.FORM_TITLE', { groupName: group.name }) }}
    </h4>
  </div>
</template>

<script setup>
import cherry from '@/authuser/assets/cherry.png'
import { useActiveGroupPreviewService } from '@/groupInfo/services'

const { group } = useActiveGroupPreviewService()
</script>
