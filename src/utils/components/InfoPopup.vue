<template>
  <QBtn
    size="sm"
    round
    flat
    color="green"
    icon="fas fa-question-circle"
    :title="tooltip"
    @click.prevent
  >
    <QMenu
      square
      dark
      max-width="280px"
      :class="menuContentClass /* TODO: check if we need class or content-class */"
    >
      <p
        v-if="title"
        class="text-h5"
      >
        {{ title }}
      </p>
      <p v-if="description">
        {{ description }}
      </p>
      <div v-else>
        <slot />
      </div>
      <QBtn
        v-close-popup
        flat
      >
        {{ $t('BUTTON.CLOSE') }}
      </QBtn>
      <QBtn
        v-if="infoLink"
        type="a"
        flat
        :href="infoLink.href"
        target="_blank"
      >
        {{ infoLink.text }}
      </QBtn>
    </QMenu>
  </QBtn>
</template>

<script>
import {
  QBtn,
  QMenu,
} from 'quasar'

export default {
  components: {
    QBtn,
    QMenu,
  },
  props: {
    tooltip: {
      default: '',
      type: String,
    },
    title: {
      default: '',
      type: String,
    },
    description: {
      default: '',
      type: String,
    },
    infoLink: {
      default: () => {},
      type: Object,
    },
    centered: {
      default: true,
      type: Boolean,
    },
  },
  computed: {
    menuContentClass () {
      const classes = ['q-pa-md', 'bg-primary']
      if (this.centered) {
        classes.push('text-center')
      }
      return classes
    },
  },
}
</script>
