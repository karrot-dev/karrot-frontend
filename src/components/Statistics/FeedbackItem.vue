<template>
  <q-card>
    <q-card-main>
      <div class="row no-wrap">
        <AmountBox class="amount-box" size="100" :amount="feedback.weight"/>
        <div class="content">
          <div>
            <strong v-if="store">{{ store.name }},</strong>
            <strong>12. Dezember, 15:00</strong>
          </div>
          <div>by {{ feedback.givenBy.displayName }} on {{ $d(feedback.createdAt, 'dateShort') }}</div>
          <div class="comment">{{ feedback.comment }}</div>
          <div>
            <ProfilePicture user="feedback.givenBy" size="22"/>
            <span class="members" v-if="membersWithoutGiver.length > 0">
              <ProfilePicture user="member" size="15" v-for="member in membersWithoutGiver" :key="member.id"/>
            </span>
          </div>
        </div>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import { QCard, QCardMain, QCardTitle } from 'quasar'
import AmountBox from './AmountBox'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'

export default {
  components: {
    QCard, QCardMain, QCardTitle, AmountBox, ProfilePicture,
  },
  props: {
    feedback: { required: true },
    store: { default: false },
    members: { default: [] },
  },
  computed: {
    membersWithoutGiver () {
      return this.members.filter((el) => {
        return el.id !== this.feedback.givenBy.id
      })
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.amount-box
  margin: auto 0
.content
  padding: .5em
.comment
  padding: .5em 0
.members
  margin-left: .5em
.members > div
  margin-right: .2em
</style>
