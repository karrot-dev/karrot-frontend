<template>
  <RouterView
    v-if="$q.platform.is.mobile"
  />
  <QLayout
    v-else
    container
    class="full-height full-width"
  >
    <QHeader>
      <IssueTabs />
    </QHeader>
    <QPageContainer>
      <QPage>
        <RouterView />
      </QPage>
    </QPageContainer>
    <QFooter>
      <RouterView name="issueFooter" />
    </QFooter>
  </QLayout>
</template>

<script>
import IssueTabs from '@/issues/components/IssueTabs'
import {
  QLayout,
  QHeader,
  QFooter,
  QPageContainer,
  QPage,
} from 'quasar'

export default {
  components: {
    IssueTabs,
    QLayout,
    QHeader,
    QFooter,
    QPageContainer,
    QPage,
  },
}
</script>
