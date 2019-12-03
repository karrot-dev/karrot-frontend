<template>
  <div>
    <img :src="cherry">
    <h4 v-t="'UNSUBSCRIBE.HEADER'" />
  </div>
</template>

<script>
import cherry from '@/authuser/assets/cherry.png'
export default {
  created () {
    this.cherry = cherry
  },
}
</script>
