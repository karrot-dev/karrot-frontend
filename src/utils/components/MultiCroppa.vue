<template>
  <div
    class="MultiCroppa"
    :class="{ small }"
  >
    <div
      v-for="(item, idx) in items"
      :key="item.key"
      class="q-ma-sm inline-block vertical-top text-center croppa-item"
      :class="itemClasses(item)"
    >
      <Croppa
        :ref="croppaRefFor(item)"
        :initial-image="initialImageFor(item)"
        :passive="isExisting(item)"
        :quality="small ? 8 : 4"
        placeholder=""
        canvas-color="transparent"
        initial-size="cover"
        :prevent-white-space="preventWhiteSpace"
        :show-remove-button="false"
        :auto-sizing="true"
        @new-image-drawn="imageDrawn(item)"
      >
        <img
          slot="placeholder"
          src="statics/add_a_photo.svg"
          :width="60"
        >
      </Croppa>
      <QBtnGroup
        rounded
        flat
      >
        <QBtn
          v-if="hasImage(item) && !small"
          rounded
          class="q-ma-xs"
          size="sm"
          icon="keyboard_arrow_left"
          :class="{ invisible: isFirstImage(idx) }"
          @click="moveImageLeft(item)"
        />
        <QBtn
          v-if="hasImage(item)"
          rounded
          size="sm"
          :class="{ 'q-ma-xs' : !small }"
          :padding="small ? 'xs' : 'xs md'"
          icon="rotate_right"
          :text-color="isExisting(item) ? 'grey' : 'green'"
          :disable="!hasImage(item) || isExisting(item)"
          @click="rotateImage(item)"
        />
        <QBtn
          v-if="hasImage(item)"
          rounded
          size="sm"
          :class="{ 'q-ma-xs' : !small }"
          :padding="small ? 'xs sm' : 'xs md'"
          icon="delete"
          text-color="red"
          :disable="!hasImage(item)"
          @click="removeImage(item)"
        />
        <QBtn
          v-if="hasImage(item) && !small"
          rounded
          class="q-ma-xs"
          size="sm"
          icon="keyboard_arrow_right"
          :class="{ invisible: isLastImage(idx) }"
          @click="moveImageRight(item)"
        />
      </QBtnGroup>
    </div>
  </div>
</template>

<script>
import { QBtn, QBtnGroup } from 'quasar'
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
    /**
     * This will accept the array from the backend. On modification there are 3 possiblities:
     * - if removing image on server `_removed: true` will be added to the image object
     * - when adding a new image an entry will be added with _new: true, and `toBlob: Function<Promise>`
     * - when changing position, the `position` field will be updated (but the position in array left the same)
     */
    value: {
      type: Array,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
    preventWhiteSpace: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      sourceKey: new Map(), // source -> key
      newItem: {
        key: getNextKey(),
      },
    }
  },
  computed: {
    items () {
      return [
        ...this.value
          .filter(item => !item._removed)
          .map(source => {
            let key = this.sourceKey.get(source)
            if (!key) {
              key = getNextKey()
              this.sourceKey.set(source, key)
            }
            return {
              key,
              source,
              position: source.position,
            }
          })
          .sort(sortByPosition),
        this.newItem,
      ]
    },
  },
  methods: {
    open () {
      this.croppaFor(this.newItem).chooseFile()
    },
    croppaRefFor (item) {
      return `croppa__${item.key}`
    },
    croppaFor (item) {
      const ref = this.$refs[this.croppaRefFor(item)]
      return ref ? ref[0] : null // ref[0] because it's in a v-for it gives me an array...
    },
    hasImage (item) {
      const croppa = this.croppaFor(item)
      return this.isExisting(item) || Boolean(croppa && croppa.hasImage())
    },
    isFirstImage (idx) {
      return idx === 0
    },
    isLastImage (idx) {
      return idx >= this.items.length - 2
    },
    isExisting (item) {
      return item.source && item.source.id !== undefined
    },
    initialImageFor (item) {
      const { source: { imageUrls: { fullSize: url } = {} } = {} } = item || {}
      if (!url) return

      // In development we want to force the images to load from our local proxy
      // so that we don't get issues with missing CORS headers
      if (process.env.DEV && url.includes('/media')) return ['http://localhost:8080', url.substring(url.indexOf('/media'))].join('')

      return url
    },
    getNextPosition () {
      let nextPosition = 0
      for (const item of this.items) {
        if (typeof item.position === 'number') {
          nextPosition = item.position + 1
        }
      }
      return nextPosition
    },
    imageDrawn (item) {
      if (this.isExisting(item)) return // this happens when showing existing images
      const { key } = item
      const position = this.getNextPosition()
      const croppa = this.croppaFor(item)

      // the item we will actually push to our value array
      // this is what things outside this component will see
      const source = {
        _new: true,
        position,
        toBlob (mimeType) {
          return croppa && croppa.hasImage() && croppa.promisedBlob(mimeType, 0.9)
        },
      }

      // record source -> key mapping
      // otherwise we will loose the association of this item with the croppa
      this.sourceKey.set(source, key)

      Object.assign(item, {
        source,
        position,
      })

      this.$emit('input', [
        ...this.value,
        source,
      ])
      this.newItem = {
        key: getNextKey(),
      }

      this.recalculatePositions()
    },
    recalculatePositions () {
      let position = 0
      for (const item of this.items) {
        if (typeof item.position === 'number') {
          item.source.position = item.position = position++
        }
      }
    },
    moveImageLeft (item) {
      const idx = this.items.indexOf(item)
      const idxLeft = idx - 1
      if (idxLeft < 0) return // there is nothing on the left
      const itemLeft = this.items[idxLeft]
      itemLeft.source.position = ++itemLeft.position
      item.source.position = --item.position
      this.recalculatePositions()
    },
    moveImageRight (item) {
      const idx = this.items.indexOf(item)
      const idxRight = idx + 1
      if (idxRight > this.items.length - 2) return // there is nothing on the right
      const itemRight = this.items[idxRight]
      itemRight.source.position = --itemRight.position
      item.source.position = ++item.position
      this.recalculatePositions()
    },
    rotateImage (item) {
      const croppa = this.croppaFor(item)
      if (croppa) {
        croppa.rotate(1)
      }
    },
    removeImage (item) {
      if (this.isExisting(item)) {
        // this item needs to be removed from the server after we save
        this.$emit('input', this.value.map(i => {
          if (i.id !== item.source.id) return i
          return {
            ...item.source,
            _removed: true,
          }
        }))
      }
      else {
        // this image was never on the server, so we can just delete it
        this.$emit('input', this.value.filter(i => i.id !== item.source.id))
      }
      // in both cases, this source item will never come back
      // so we can forget the source -> key mapping
      this.sourceKey.delete(item.source)
      this.recalculatePositions()
    },
    itemClasses (item) {
      return this.hasImage(item) ? [] : ['new-image']
    },
  },
}
</script>

<style scoped lang="stylus">
.croppa-container.croppa--has-target
  cursor move

.small
  .croppa-item
    width 80px

  >>> .croppa-container
    width 80px
    height 80px

.new-image >>> canvas
  cursor pointer
  border 1px solid #ddd
</style>
