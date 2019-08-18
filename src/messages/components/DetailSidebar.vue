<template>
  <div class="absolute-full column">
    <DetailHeader
      class="col-auto"
      @close="$emit('close')"
    />
    <Detail
      class="col relative-position"
      inline
    />
  </div>
</template>

<script>
import DetailHeader from './DetailHeader'
import Detail from './Detail'

export default {
  components: {
    DetailHeader,
    Detail,
  },
}
</script>
