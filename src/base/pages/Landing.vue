<template>
  <div class="landing bg-white q-pa-lg">
    <p class="text-center">
      <img
        :src="logo"
        class="logo"
      >
    </p>
    <h1>Save things from being wasted, share them instead!</h1>
    <p>
      <strong>
        Karrot exists for groups of people who want to save things from being wasted and share them instead,
        allowing these groups to organise efficiently, on a local and voluntary basis.
      </strong>
    </p>
    <p>
      Things such as food, bikes, clothes or whatever is being excessively thrown away or unused in the context of a consumerist society.
    </p>
    <p class="text-center q-py-lg">
      <a
        class="button"
        href="/#/signup"
      >Signup!</a>
      or
      <a
        class="button"
        href="/#/groupPreview"
      >Browse existing groups</a>
    </p>
    <p class="text-center">
      <img
        :src="screenshots.pickups"
        alt="karrot"
        class="screenshot screenshot-fullwidth q-my-lg"
      >
    </p>

    <p>
      Our vision, as the team of passionate volunteers developing Karrot,
      is to make a free and open-source software that enables a movement to grow,
      a movement that is based on communities and networks that save and share
      resources and that are socially and ecologically sustainable.
    </p>
    <p>
      Karrot has started as a foodsaving tool but is widening in scope as it is progressively
      being developed to become a platform for all kinds of grassroots initiatives to connect and grow.
    </p>
    <p>
      Our main motivation is to support face-to-face activities with a layer of
      digital infrastructure so that our users can concentrate on their sustainability
      endeavors and scale them without getting lost in chaos or bureaucracy.
    </p>
    <p>
      Have you already found a group nearby you? Or maybe you want to
      <a href="https://karrot.world/#/group/create">start one</a>?
      If you just want to try Karrot out, then create an account
      and join the Playgroud group for testing.
    </p>

    <hr>

    <section class="row q-my-lg q-py-lg">
      <div class="col-sm-8 q-px-lg self-center">
        <h2>Independent groups</h2>
        <p>
          <strong>Every group on karrot is completely independent and can have their own logo, processes and rules.</strong>
        </p>
        <p>
          Yet they are all displayed on the map so that people can find and connect to other groups in their location and even globally.
        </p>
      </div>
      <div class="col q-px-lg self-center">
        <img
          :src="screenshots.gallery"
          alt="karrot"
          class="screenshot"
        >
      </div>
    </section>

    <hr>

    <section class="row q-my-lg q-py-lg">
      <div class="col q-px-lg self-center">
        <img
          :src="screenshots.managePickups"
          alt="karrot"
          class="screenshot"
        >
      </div>
      <div class="col-sm-8 q-px-lg self-center">
        <h2>Distribution of tasks and activities</h2>
        <p>
          <strong>Activities with a specific time and place, like food pickups in the case of foodsaving, can be entered in the software.</strong>
        </p>
        <p>
          Each activity has a number of slots which members of the group can sign up for –
          this way everyone knows who goes where and when, and feedback can be given later.
        </p>
      </div>
    </section>

    <hr>

    <section class="row q-my-lg q-py-lg">
      <div class="col-sm-8 q-px-lg self-center">
        <h2>Share things</h2>
        <p>
          <strong>Create an ad-like offer of whatever you want to share or give away.</strong>
        </p>
        <p>
          Offers are visible to everyone in the group and people can show their interest on the offer's chat.
        </p>
      </div>
      <div class="col q-px-lg self-center">
        <img
          :src="screenshots.offers"
          alt="karrot"
          class="screenshot"
        >
      </div>
    </section>

    <hr>

    <section class="q-my-lg q-py-lg">
      <h2>Democratic and participative development</h2>
      <p>
        Karrot is a free and open-source software developed with the feedback and participation
        of the people who use it. It is mainly developed by a small core team that
        is constantly in contact with people in different groups, in order to make sense
        of their diverging and converging needs and thus guide the development.
        We abide by the ethics of integrity and non-commercialization of data.
      </p>
      <p>
        Developers and designers are obviously welcome to participate in its development.
        Check out the project on <a href="https://github.com/yunity/karrot-frontend">GitHub</a>.
      </p>
    </section>

    <hr>

    <p>
      <em>And more...</em>
    </p>
    <ul>
      <li>
        <p><strong>Communication in the right context</strong>: write a message that everyone in the group will see or a private message to someone. Everything related to a single activity or place can be discussed in their respective chats.</p>
      </li>
      <li>
        <p><strong>Democratic and trust-based group management</strong>: There are no admin superpowers in a Karrot group. People who receive enough trust-carrots from their peers will be able to edit and change settings in the group. When new people want to join your group they need to apply and answer questions your group can set, which anyone with editing rights can decline or approve. Likewise, if there is a conflict, the group can enter a voting system to resolve it in a communal way.</p>
      </li>
      <li>
        <p><strong>Maps and lists</strong>: You have a map of where the places and the people doing the activities are located. You have a nice list of upcoming activities and can sign up for them online.</p>
      </li>
      <li>
        <p><strong>Transparency</strong>: The history shows who did what and when. Everything from participating in an activity to creating and editing places is logged here.</p>
      </li>
      <li>
        <p><strong>Notifications</strong>: You get notified about empty activities, new messages and new people wanting to join your group. But you can also turn it all off if you wish more peace!</p>
      </li>
      <li>
        <p><strong>Multi-language</strong>: Karrot is fully translatable by the community and many languages are already added. To contribute more translations just visit the project on <a href="https://www.transifex.com/yunity-1/karrot/frontend/">Transifex</a>.</p>
      </li>
      <li>
        <p><strong>Open source</strong>: Everything is transparent and possibly changeable. We encourage groups to host their own instances of the platform, if they have the ability to do so. Still, we also provide access to a hosted version on karrot.world.</p>
      </li>
      <li>
        <p><strong>Responsive team</strong>: You can easily talk to the people developing Karrot, either on our <a href="https://community.foodsaving.world/">community forum</a>, on <a href="https://github.com/yunity/karrot-frontend">GitHub</a> or in real-time on our <a href="https://slackin.yunity.org/">team chat</a> (join the channel #foodsaving-worldwide or #karrot-dev to reach the right people immediately).</p>
      </li>
    </ul>
  </div>
</template>

<script>
import logo from '@/logo/assets/carrot-logo.svg'
import screenshotPickups from './karrot-pickups.png'
import screenshotGallery from './karrot-gallery.png'
import screenshotManagePickups from './karrot-manage-pickups.png'
import screenshotOffers from './karrot-offers.png'
export default {
  created () {
    this.logo = logo
    this.screenshots = {
      pickups: screenshotPickups,
      gallery: screenshotGallery,
      managePickups: screenshotManagePickups,
      offers: screenshotOffers,
    }
  },
}
</script>

<style scoped lang="stylus">
.landing
  width 900px
  max-width 100vw
  margin 0 auto

  a
    text-decoration underline

  p
    font-size 140%

  h2
    margin-top 0

  hr
    margin 20px 0
    border 0
    border-bottom 1px dashed #ddd

  .button
    padding 10px
    margin 0 10px
    color white
    text-decoration none
    text-transform uppercase
    background var(--q-color-secondary)
    border-radius 3px

.logo
  width 120px

.screenshot
  width 100%
  box-shadow 1px 4px 10px rgba(1, 1, 1, .8)

// have the feature section descriptions before the image when it's one column
@media (max-width: 599px)
  section
    .col-sm-8
      order -10000

.screenshot-fullwidth
  @media (min-width: 1100px)
    width 1100px
    // horizontally center the oversized image
    margin-left 50%
    transform translateX(-50%)

</style>
