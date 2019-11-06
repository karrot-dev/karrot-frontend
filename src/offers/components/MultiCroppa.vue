<template>
  <div class="MultiCroppa">
    <div
      v-for="(photo, idx) in photos"
      :key="photo._key"
      class="q-ma-sm inline-block vertical-top text-center"
    >
      <!-- TODO: need to work out how get existing images in...
           quite a few cases to handle:
           - move position, but keep image the same, don't upload again!
           - add a new image to existing ones
           - remove an image (e.g. in the middle)
      -->
      <Croppa
        ref="croppaRefs"
        placeholder="+"
        :class="croppaClasses(idx)"
        prevent-white-space
        :show-remove-button="false"
        @new-image-drawn="imageDrawn(idx)"
      />
      <QBtnGroup
        rounded
        flat
      >
        <QBtn
          v-if="hasImage(idx)"
          rounded
          class="q-ma-xs"
          size="sm"
          icon="keyboard_arrow_left"
          :disable="isFirstImage(idx)"
          @click="moveImage(idx, -1)"
        />
        <QBtn
          v-if="hasImage(idx)"
          rounded
          class="q-ma-xs"
          size="sm"
          icon="delete"
          text-color="red"
          :disable="!hasImage(idx)"
          @click="removeImage(idx)"
        />
        <QBtn
          v-if="hasImage(idx)"
          rounded
          class="q-ma-xs"
          size="sm"
          icon="keyboard_arrow_right"
          :disable="isLastImage(idx)"
          @click="moveImage(idx, 1)"
        />
      </QBtnGroup>
    </div>
    <pre>photos: {{ photos }}</pre>
    <pre>value: {{ value }}</pre>
  </div>
</template>

<script>
import { QBtn, QBtnGroup } from 'quasar'
import CroppaPlugin from 'vue-croppa'
const Croppa = CroppaPlugin.component

let nextKey = 0
function getNextKey () {
  return ++nextKey
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
      photos: [{
        _key: getNextKey(),
      }],
    }
  },
  methods: {
    async imageDrawn (idx) {
      const photo = this.photos[idx]
      const croppa = this.$refs.croppaRefs[idx]
      if (croppa.hasImage()) {
        const blob = await croppa.promisedBlob('image/png', 0.9)
        const valueItem = {
          ...photo,
          blob,
          position: this.value.length,
        }
        delete valueItem._key
        this.value.push(valueItem)
        photo.valueItem = valueItem // keep a ref to the "external" object
      }
      // Add the box for adding another new image
      this.photos.push({ _key: getNextKey() })
    },
    removeImage (idx) {
      const photo = this.photos[idx]
      const valueIdx = this.value.indexOf(photo.valueItem)
      if (valueIdx !== -1) {
        this.value.splice(valueIdx, 1)
      }
      this.photos.splice(idx, 1)
      this.$refs.croppaRefs.splice(idx, 1)
      if (this.photos.length === 0) this.photos.push({ _key: getNextKey() })
      this.recalculationPositions()
    },
    moveImage (idx, by) {
      const newIdx = idx + by
      this.photos.splice(newIdx, 0, this.photos.splice(idx, 1)[0])
      this.$refs.croppaRefs.splice(newIdx, 0, this.$refs.croppaRefs.splice(idx, 1)[0])
      this.recalculationPositions()
    },
    recalculationPositions () {
      for (const idx of Object.keys(this.photos)) {
        const photo = this.photos[idx]
        if (photo.valueItem) photo.valueItem.position = parseInt(idx)
      }
    },
    hasImage (idx) {
      if (!this.$refs.croppaRefs) return
      const croppa = this.$refs.croppaRefs[idx]
      return croppa && croppa.hasImage && croppa.hasImage()
    },
    isFirstImage (idx) {
      return idx === 0
    },
    isLastImage (idx) {
      return idx >= this.photos.length - 2
    },
    croppaClasses (idx) {
      if (this.hasImage(idx)) return []
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
