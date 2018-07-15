<template>
  <q-card class="no-shadow grey-border">
    <q-card-main class="generic-padding">
      <div class="row no-wrap">
        <AmountBox
          v-if="hasWeight"
          class="amount-box"
          :size="80"
          :amount="weight"
        />
        <div class="content">
          <div>
            <strong class="small-margin-right">{{ $d(pickupDate, 'long') }}</strong>
            <router-link
              v-if="storeName && storeId"
              :to="{ name: 'store', params: { storeId }}">
              <span class="text-secondary small-margin-right">{{ storeName }}</span>
            </router-link>
            <router-link
              v-if="feedback.isEditable"
              class="edit-button"
              :to="{ name: 'pickupFeedback', params: { feedbackId: feedback.id }}"
            >
              <q-icon name="fas fa-pencil-alt">
                <q-tooltip v-t="'BUTTON.EDIT'" />
              </q-icon>
            </router-link>
          </div>
          <small class="text-weight-light">
            <router-link
              place="user"
              :to="{ name: 'user', params: { userId } }">
              <span >{{ userName }}</span>
            </router-link>
            <span
              class="message-date"
              place="date">
              <DateAsWords :date="createdAt" />
            </span>
          </small>
          <div
            v-if="comment"
            class="comment"
          >
            <Markdown :source="comment"/>
          </div>
          <div class="people">
            <ProfilePicture
              :user="feedback.givenBy"
              :size="22"
            />
            <span
              v-if="membersWithoutGiver.length > 0"
              class="members"
            >
              <ProfilePicture
                v-for="member in membersWithoutGiver"
                :key="member.id"
                user="member"
                :size="15"
              />
            </span>
          </div>
        </div>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import { QCard, QCardMain, QCardTitle, QTooltip, QIcon } from 'quasar'
import AmountBox from './AmountBox'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import DateAsWords from '@/components/General/DateAsWords'
import Markdown from '@/components/Markdown'

export default {
  components: {
    QCard, QCardMain, QCardTitle, QTooltip, QIcon, AmountBox, ProfilePicture, DateAsWords, Markdown,
  },
  props: {
    feedback: { required: true, type: Object },
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
    hasWeight () {
      return Number.isFinite(this.weight)
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
    storeId () {
      const { about: { store: { id } = {} } = {} } = this.feedback
      return id
    },
    userName () {
      return this.feedback && this.feedback.givenBy && this.feedback.givenBy.displayName
    },
    userId () {
      return this.feedback && this.feedback.givenBy && this.feedback.givenBy.id
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
  padding-top 8px
  word-wrap break-word
  >>> p:last-child
    margin-bottom 5px
.people
  margin-top: .3em
  .members
    margin-left: .5em
.members > div, .small-margin-right
  margin-right: .2em
.message-date
  display inline-block
.edit-button
  opacity .7
.q-card:hover .edit-button
  opacity 1
</style>
