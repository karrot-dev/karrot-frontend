<template>
</template>

<script>
import { QTooltip } from 'quasar'

export default {
  props: {
    name: {
      required: true,
    },
    seed: {
      default: 2,
    },
    size: {
      required: true,
    },
  },
  components: {
    QTooltip,
  },
  mounted () {
    function pseudoRandom (seed) {
      let random = Math.sin(seed) * 10000
      random -= Math.floor(random)
      return random
    }

    let seed = pseudoRandom(this.seed)
    let size = this.size

    function getRandomRange (min, max, add = 1000) {
      return Math.floor(pseudoRandom(seed * add) * (max - min) + min)
    }
    const svgns = 'http://www.w3.org/2000/svg'
    const box = document.createElementNS(svgns, 'svg')

    const rows = 3
    const columns = 3
    const blockSize = Math.floor(size / 2)
    const rotate = blockSize * rows / 2

    box.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    box.setAttribute('width', size)
    box.setAttribute('height', size)
    box.setAttribute('viewbox', '0 0 100 100')
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
        rect.setAttribute('height', blockSize)
        rect.setAttribute('fill', 'rgba(' +
          getRandomRange(100, 255, (i + 1) * (j + 1) * 1) + ',' +
          getRandomRange(100, 255, (i + 1) * (j + 1) * 2) + ',' +
          getRandomRange(100, 255, (i + 1) * (j + 1) * 3) + ',1)',
        )
        rect.setAttribute('x', i * blockSize)
        rect.setAttribute('y', j * blockSize)

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

    if (this.name) {
      let name = this.name.substring(0, 2).toUpperCase()

      let initials = document.createTextNode(name)
      let textOverlay = document.createElementNS(svgns, 'text')
      textOverlay.setAttribute('width', size)
      textOverlay.setAttribute('height', size)
      textOverlay.setAttribute('fill', 'rgba(0,0,0,1)')
      textOverlay.setAttribute('font-size', blockSize)
      textOverlay.setAttribute('text-anchor', 'middle')
      textOverlay.setAttribute('x', blockSize)
      textOverlay.setAttribute('y', blockSize * 1.3)
      textOverlay.appendChild(initials)
      box.appendChild(textOverlay)
    }

    this.$el.append(box)
  },
}
</script>

<style scoped lang='stylus'>
</style>