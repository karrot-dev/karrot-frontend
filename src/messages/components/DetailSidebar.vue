<template>
  <QLayout
    container
    class="full-height full-width"
  >
    <QLayoutHeader reveal>
      <DetailHeader
        @close="$emit('close')"
      />
    </QLayoutHeader>
    <QPageContainer>
      <QPage>
        <Detail/>
      </QPage>
    </QPageContainer>
    <QLayoutFooter>
      <DetailFooter />
    </QLayoutFooter>
  </QLayout>
</template>

<script>
import {
  QLayout,
  QLayoutHeader,
  QPageContainer,
  QPage,
  QLayoutFooter,
} from 'quasar'

import DetailHeader from './DetailHeader'
import Detail from './Detail'
import DetailFooter from './DetailFooter'

export default {
  components: {
    QLayout,
    QLayoutHeader,
    QPageContainer,
    QPage,
    QLayoutFooter,
    DetailHeader,
    Detail,
    DetailFooter,
  },
}
</script>
