<template>
  <span/>
</template>

<script>
export default {
  props: {
    seed: { default: 2 },
    size: { default: 1000 },
  },
  mounted () {
    this.$el.appendChild(this.box)
  },
  watch: {
    box (box, prevBox) {
      this.$el.replaceChild(box, prevBox)
    },
  },
  computed: {
    box () {
      function pseudoRandom (seed) {
        let random = Math.sin(seed) * 10000
        random -= Math.floor(random)
        return random
      }

      const ratio = 1.2

      let seed = pseudoRandom(this.seed)
      let size = 100
      // let sizeHeight = Math.floor(size / ratio)

      function getRandomRange (min, max, add = 1000) {
        return Math.floor(pseudoRandom(seed * add) * (max - min) + min)
      }

      const svgns = 'http://www.w3.org/2000/svg'
      const box = document.createElementNS(svgns, 'svg')

      const rows = 10
      const columns = 10
      const blockSize = Math.floor(size / rows * 2)
      const blockSizeHeight = Math.floor(blockSize / ratio)
      const rotate = blockSize * rows / 2

      // box.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      // box.setAttribute('width', size)
      // box.setAttribute('height', sizeHeight)
      box.setAttribute('width', '100%')
      box.setAttribute('height', '100%')
      // box.setAttribute('style', 'width: 100%; height: auto')
      box.setAttribute('viewBox', '0 0 100 4')
      box.setAttribute('class', 'box')

      const g = document.createElementNS(svgns, 'g')
      g.setAttribute(
        'transform',
        `translate(${-(rows * blockSize - size) / 2} ${-((rows * blockSize - size) / 2)}) ` +
        `rotate(${90 * seed} ${rotate} ${rotate})`,
      )

      for (let i = 0; i < columns; i++) {
        // noprotect
        for (let j = 0; j < rows; j++) {
          let rect = document.createElementNS(svgns, 'rect')
          rect.setAttribute('width', blockSize)
          rect.setAttribute('height', blockSizeHeight)
          rect.setAttribute('fill', 'rgba(' +
            getRandomRange(100, 255, (i + 1) * (j + 1) * 1) + ',' +
            getRandomRange(100, 255, (i + 1) * (j + 1) * 2) + ',' +
            getRandomRange(100, 255, (i + 1) * (j + 1) * 3) + ',1)',
          )
          rect.setAttribute('x', i * blockSize)
          rect.setAttribute('y', j * blockSizeHeight)

          g.appendChild(rect)
        }
      }
      box.appendChild(g)

      let overlay = document.createElementNS(svgns, 'rect')
      overlay.setAttribute('width', size)
      overlay.setAttribute('height', size)
      overlay.setAttribute('fill', 'rgba(' +
        getRandomRange(100, 255, 1) + ',' +
        getRandomRange(100, 255, 2) + ',' +
        getRandomRange(100, 255, 3) + ',0.5)',
      )
      overlay.setAttribute('x', 0)
      overlay.setAttribute('y', 0)
      box.appendChild(overlay)
      return box
    },
  },
}
</script>

<style scoped lang='stylus'>
</style>
