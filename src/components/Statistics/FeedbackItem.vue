<template>
  <q-card class="no-shadow grey-border">
    <q-card-main>
      <div class="row no-wrap">
        <AmountBox
          class="amount-box"
          size="100"
          :amount="weight"
        />
        <div class="content">
          <div>
            <strong v-if="storeName">{{ storeName }}:</strong>
            <strong>{{ $d(pickupDate, 'long') }}</strong>
          </div>
          <i18n path="PICKUP_FEEDBACK.GIVEN_BY">
            <span place="user">{{ userName }}</span>
            <span place="date">{{ $d(createdAt, 'dateShort') }}</span>
          </i18n>
          <div class="comment">{{ comment }}</div>
          <div>
            <ProfilePicture
              :user="feedback.givenBy"
              size="22"
            />
            <span
              v-if="membersWithoutGiver.length > 0"
              class="members"
            >
              <ProfilePicture
                v-for="member in membersWithoutGiver"
                :key="member.id"
                user="member"
                size="15"
              />
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
  },
  computed: {
    membersWithoutGiver () {
      const { pickup: { collectors = [] } = {} } = this.feedback
      return collectors.filter((el) => {
        return el.id !== this.feedback.givenBy.id
      })
    },
    weight () {
      return this.feedback && this.feedback.weight
    },
    comment () {
      return this.feedback && this.feedback.comment
    },
    createdAt () {
      return this.feedback && this.feedback.createdAt
    },
    storeName () {
      const { about: { store: { name } = {} } = {} } = this.feedback
      return name
    },
    userName () {
      return this.feedback && this.feedback.givenBy && this.feedback.givenBy.displayName
    },
    pickupDate () {
      return this.feedback && this.feedback.about && this.feedback.about.date
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
