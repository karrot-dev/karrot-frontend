<template>
  <RouterView
    v-if="$q.platform.is.mobile"
  />
  <QLayout
    v-else
    container
    class="full-height full-width"
  >
    <QLayoutHeader>
      <IssueTabs />
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
import IssueTabs from '@/issues/components/IssueTabs'
import {
  QLayout,
  QLayoutHeader,
  QLayoutFooter,
  QPageContainer,
  QPage,
} from 'quasar'

export default {
  components: {
    IssueTabs,
    QLayout,
    QLayoutHeader,
    QLayoutFooter,
    QPageContainer,
    QPage,
  },
}
</script>
