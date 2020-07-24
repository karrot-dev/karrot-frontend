<template>
  <div>
    <RouterLink :to="{name: 'giveFeedback'}">
      <QCard
        class="q-pa-md notice bg-info"
      >
        <QIcon
          class="on-left"
          :name="$icon('feedback')"
        />
        {{ $tc('ACTIVITYLIST.AVAILABLE_FEEDBACK', feedbackPossible.length, { count: feedbackPossible.length }) }}
      </QCard>
    </RouterLink>
  </div>
</template>

<script>
import {
  QCard,
  QIcon,
} from 'quasar'

export default {
  components: {
    QCard,
    QIcon,
  },
  props: {
    feedbackPossible: { required: true, type: Array },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.list-leave-active
  transition all .5s

.list-leave-to
  opacity 0
  transform translateX(-50px)

.q-card.notice
  color $primary !important
  cursor pointer
  transition all .2s ease

.q-card.notice:hover
  box-shadow 1px 2px 2px 1px rgba(0, 0, 0, 0.4)
</style>
