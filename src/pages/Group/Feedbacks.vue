<template>
  <div>
    <KNotice>
      <template slot="icon">
        <i class="fa fa-alert"/>
      </template>
      Not created yet
      <template slot="desc">
        This will later become the list of feedback
      </template>
    </KNotice>
  </div>
</template>

<script>
import KNotice from '@/components/General/KNotice'

export default {
  components: { KNotice },
}
</script>

<style scoped lang="stylus">
</style>
