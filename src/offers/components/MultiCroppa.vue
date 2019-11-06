<template>
  <div class="MultiCroppa">
    <div
      v-for="(item, idx) in items"
      :key="item.key"
      class="q-ma-sm inline-block vertical-top text-center"
    >
      <Croppa
        v-model="item.croppa"
        :initial-image="imageFor(item)"
        :passive="isExisting(item)"
        placeholder="+"
        prevent-white-space
        :show-remove-button="false"
        @new-image-drawn="imageDrawn(item)"
        :class="croppaClasses(item)"
      />
      <QBtnGroup
        rounded
        flat
      >
        <QBtn
          v-if="hasImage(item)"
          rounded
          class="q-ma-xs"
          size="sm"
          icon="keyboard_arrow_left"
          :disable="isFirstImage(idx)"
          @click="moveImage(item, -1)"
        />
        <QBtn
          v-if="hasImage(item)"
          rounded
          class="q-ma-xs"
          size="sm"
          icon="delete"
          text-color="red"
          :disable="!hasImage(item)"
          @click="removeImage(item)"
        />
        <QBtn
          v-if="hasImage(item)"
          rounded
          class="q-ma-xs"
          size="sm"
          icon="keyboard_arrow_right"
          :disable="isLastImage(idx)"
          @click="moveImage(item, 1)"
        />
      </QBtnGroup>
    </div>
  </div>
</template>

<script>
import { QBtn, QBtnGroup } from 'quasar'
import deepEqual from 'deep-equal'
import CroppaPlugin from 'vue-croppa'
const Croppa = CroppaPlugin.component

function sortByPosition (a, b) {
  return a.position - b.position
}

let nextKey = 0
function getNextKey () {
  const key = `key-${nextKey}`
  nextKey++
  return key
}

export default {
  components: {
    QBtn,
    QBtnGroup,
    Croppa,
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      items: [],
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (value, oldValue) {
        if (deepEqual(value, oldValue)) return

        // This initializes our "items" array from the outside "value" array

        this.items = this.value.map((item, idx) => ({
          ...item,
          key: getNextKey(),
          sourceIndex: idx,
          croppa: null,
        }))
        this.items.sort(sortByPosition)
        this.items.push({ key: getNextKey(), croppa: null })
        this.recalculationPositions()
      },
    },
  },
  methods: {
    hasImage (item) {
      return this.isExisting(item) || Boolean(item.croppa && item.croppa.hasImage())
    },
    isFirstImage (idx) {
      return idx === 0
    },
    isLastImage (idx) {
      return idx >= this.items.length - 2
    },
    isExisting (item) {
      return item.id !== undefined
    },
    imageFor (item) {
      const url = item && item.imageUrls && item.imageUrls.fullSize
      if (!url) return

      // In development we want to force the images to load from our local proxy
      // so that we don't get issues with missing CORS headers
      if (__ENV.DEV && url.includes('/media')) return ['http://localhost:8080', url.substring(url.indexOf('/media'))].join('')

      return url
    },
    imageDrawn (item) {
      const isNew = !item.id
      if (isNew) {
        this.value.push({
          _new: true,
          toBlob () {
            return item.croppa.hasImage() && item.croppa.promisedBlob()
          },
        })
        item.sourceIndex = this.value.length - 1
        this.items.push({
          key: getNextKey(),
          croppa: null,
        })
        this.recalculationPositions()
      }
    },
    moveImage (item, by) {
      const idx = this.items.indexOf(item)
      const newIdx = idx + by
      this.items.splice(newIdx, 0, this.items.splice(idx, 1)[0])
      this.recalculationPositions()
    },
    removeImage (item) {
      const idx = this.items.indexOf(item)
      this.items.splice(idx, 1)
      if (this.isExisting(item)) {
        const source = this.value[item.sourceIndex]
        this.$set(source, '_removed', true)
      }
      this.recalculationPositions()
    },
    recalculationPositions () {
      for (const idx of Object.keys(this.items)) {
        const item = this.items[idx]
        const position = parseInt(idx)
        item.position = position
        if (item.sourceIndex !== undefined) {
          const source = this.value[item.sourceIndex]
          source.position = position
        }
      }
    },
    croppaClasses (item) {
      if (this.hasImage(item)) return []
      return ['new-image']
    },
  },
}
</script>

<style scoped lang="stylus">
.new-image >>> canvas
  border 1px solid #ddd
.MultiCroppa >>> .q-btn.disabled
  visibility hidden
</style>
