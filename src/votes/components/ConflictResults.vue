<template>
  <div>
    <QCard>
      <QCardTitle>
        {{ $t('CONFLICT.VOTE.TIME_UP') }}
      </QCardTitle>
      <QCardMain>
        {{ $t('CONFLICT.VOTE.RESULTS') }}
        <QList
          separator
        >
          <QItem>
            <QItemSide>
              <QBtn
                round
                color="secondary"
              >
              <p>1</p>
              </QBtn>
            </QItemSide>
            <QItemMain>
              {{ $t('CONFLICT.VOTE.OPTION_ONE') }}
            </QItemMain>
            <QItemSide
              icon="far fa-grin"
            />
          </QItem>
        </QList>
      </QCardMain>
    </QCard>
  </div>
</template>

<script>
import {
  QCard,
  QCardMain,
  QCardTitle,
  QList,
  QItem,
  QItemSide,
  QItemMain,
  QBtn,
} from 'quasar'

export default {
  components: {
    QCard,
    QCardMain,
    QCardTitle,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QBtn,
  },
}
</script>
