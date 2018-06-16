<template>
  <div class="MobileDetail absolute-full">
    <Detail @close="onClose"/>
  </div>
</template>

<script>
import Detail from '@/components/General/Detail'
import router from '@/router'

export default {
  components: { Detail },
  methods: {
    onClose () {
      router.push('/')
    },
  },
}
</script>

<style scoped lang="stylus">
.MobileDetail
  margin-top 50px
  margin-bottom 70px
</style>
