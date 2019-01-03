<template>
  <QCard
    class="no-mobile-margin no-padding no-shadow grey-border"
  >
    <RandomArt
      :seed="groupid"
      type="circles">
      <div class="art-overlay">
        <div class="header">
          <span>
            <i class="fas fa-user-plus" />
            {{ $t('GROUP.INVITE_TITLE') }}
          </span>
        </div>
        <div class="content">
          <div class="subtitle">
            <InvitationsForm
              :invitations="invitations"
              :status="sendStatus"
              @submit="$emit('submit', arguments[0])"
            />
          </div>
        </div>
      </div>
    </RandomArt>
    <InvitationsList
      :invitations="invitations"
      :status="fetchStatus"
    />
  </QCard>
</template>

<script>
import { QCard, QBtn, QTooltip, QIcon } from 'quasar'
import InvitationsForm from './InvitationsForm'
import InvitationsList from './InvitationsList'
import RandomArt from '@/utils/components/RandomArt'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { RandomArt, QCard, QBtn, QTooltip, QIcon, InvitationsForm, InvitationsList },
  props: {
    invitations: {
      type: Array,
      required: true,
    },
    fetchStatus: {
      type: Object,
      required: true,
    },
    sendStatus: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      groupid: 'currentGroup/id',
    }),
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.art-overlay
  .header
    color white
    span
      font-size 1.3em
  .content
    .subtitle
      color white
      padding-top 6px

body.desktop .art-overlay
  .header
    padding 3em 2em 0em 2em
    background linear-gradient(to top, rgba(0,0,0,$groupNavOverlay) 0%, rgba(0,0,0,0) 90%)
  .content
    padding 0em 2em 2em 2em
    background rgba(0,0,0,$groupNavOverlay)

body.mobile .art-overlay
  background rgba(0,0,0,$groupNavOverlay)
  .header
    padding 10px 25px 0 25px
  .content
    padding 0px 25px 20px 25px
</style>
