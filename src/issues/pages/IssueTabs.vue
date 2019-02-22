<template>
  <QLayout
    container
    class="full-height full-width"
  >
    <QLayoutHeader reveal>
      <QTabs
        animated
        align="justify"
      >
        <QRouteTab
          :to="{ name: 'issueChat' }"
          default
          slot="title"
          name="chat"
          icon="fas fa-comments"
        />
        <QRouteTab
          :to="{ name: 'issueVote' }"
          slot="title"
          name="vote"
          icon="fas fa-vote-yea"
        />
      </QTabs>
    </QLayoutHeader>
    <QPageContainer>
      <QPage>
        <RouterView />
      </QPage>
    </QPageContainer>
    <QLayoutFooter>
      <RouterView name="issueFooter" />
    </QLayoutFooter>
  </QLayout>
</template>

<script>
import {
  QTabs,
  QRouteTab,
  QLayout,
  QLayoutHeader,
  QLayoutFooter,
  QPageContainer,
  QPage,
} from 'quasar'

export default {
  components: {
    QTabs,
    QRouteTab,
    QLayout,
    QLayoutHeader,
    QLayoutFooter,
    QPageContainer,
    QPage,
  },
}
</script>
