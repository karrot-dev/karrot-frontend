const DEFINITIONS = {}

export const SVGNS = 'http://www.w3.org/2000/svg'

export function createUseElement (id) {
  const el = document.createElementNS(SVGNS, 'use')
  el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + id)
  return el
}

export function ensureBox (id, { seed, type, above, text, initials }) {
  if (DEFINITIONS[id]) return
  const box = createBox({ seed, type, above, text, initials })
  box.setAttribute('id', id)
  DEFINITIONS[id] = true
  addDefinition(box)
}

export function createBox ({ seed, type, above, text, initials }) {
  function pseudoRandom (seed) {
    let random = Math.sin(seed) * 10000
    random -= Math.floor(random)
    return random
  }

  seed = pseudoRandom(seed)

  function getRandomRange (min, max, add = 1000) {
    return Math.floor(pseudoRandom(seed * add) * (max - min) + min)
  }

  const box = document.createElementNS(SVGNS, 'g')

  let rows = 3
  let columns = 3
  let ratio = 1.0

  if (type === 'banner') {
    rows = 7
    columns = 7
    ratio = 1.3
  }

  const size = 100
  const blockSize = Math.floor(size / rows * 1.5)
  const blockSizeHeight = Math.floor(blockSize / ratio)
  const rotate = blockSize * rows / 2
  const opacity = 0.2

  if (type === 'lines') {
    box.setAttribute('style', 'background-color:' + 'rgba(' +
      getRandomRange(140, 200, 1) + ',' +
      getRandomRange(140, 180, 2) + ',' +
      getRandomRange(140, 180, 3) + ',.6)')
    for (let i = 0; i < 20; i++) {
      let randomMultipl = i * 6
      let line = document.createElementNS(SVGNS, 'line')
      line.setAttribute('stroke', 'rgba(' +
        getRandomRange(100, 250, 2 + randomMultipl) + ',' +
        getRandomRange(100, 250, 4 + randomMultipl) + ',' +
        getRandomRange(100, 250, 3 + randomMultipl) + ',1)',
      )
      line.setAttribute('stroke-width', getRandomRange(2, 5, 1 + i))
      line.setAttribute('x1', getRandomRange(-50, 150, 1 + randomMultipl))
      line.setAttribute('y1', getRandomRange(-50, 150, 2 + randomMultipl))
      line.setAttribute('x2', getRandomRange(-50, 150, 3 + randomMultipl))
      line.setAttribute('y2', getRandomRange(-50, 150, 4 + randomMultipl))
      line.setAttribute('opacity', opacity)
      box.appendChild(line)
    }
  }
  if (type === 'circles') {
    box.setAttribute('style', 'background-color:' + 'rgba(' +
      getRandomRange(120, 160, 1) + ',' +
      getRandomRange(130, 170, 3) + ',' +
      getRandomRange(120, 170, 5) + ',1)')
    for (let i = 0; i < 80; i++) {
      let randomMultipl = i * 6
      let circle = document.createElementNS(SVGNS, 'circle')
      circle.setAttribute('fill', 'rgba(' +
        getRandomRange(100, 250, 3 + randomMultipl) + ',' +
        getRandomRange(100, 250, 3 + randomMultipl) + ',' +
        getRandomRange(100, 250, 3 + randomMultipl) + ',1)',
      )
      circle.setAttribute('cx', getRandomRange(-50, 150, 1 + randomMultipl))
      circle.setAttribute('cy', getRandomRange(-50, 150, 2 + randomMultipl))
      circle.setAttribute('r', getRandomRange(1, 15, 3 + randomMultipl))
      circle.setAttribute('opacity', opacity)
      box.appendChild(circle)
    }
  }
  if (type === 'banner' || type === 'profile') {
    const g = document.createElementNS(SVGNS, 'g')
    g.setAttribute(
      'transform',
      `translate(${-(rows * blockSize - size) / 2} ${-((rows * blockSize - size) / 2)}) ` +
      `rotate(${90 * seed} ${rotate} ${rotate})`,
    )

    for (let i = 0; i < columns; i++) {
      // noprotect
      for (let j = 0; j < rows; j++) {
        let rect = document.createElementNS(SVGNS, 'rect')
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

    let overlay = document.createElementNS(SVGNS, 'rect')
    overlay.setAttribute('width', 2 * size)
    overlay.setAttribute('height', 2 * size)
    overlay.setAttribute('fill', 'rgba(' +
      getRandomRange(100, 255, 1) + ',' +
      getRandomRange(100, 255, 2) + ',' +
      getRandomRange(100, 255, 3) + ',0.5)',
    )
    overlay.setAttribute('x', -40)
    overlay.setAttribute('y', -40)
    box.appendChild(overlay)

    let textOverlay = document.createElementNS(SVGNS, 'text')
    textOverlay.setAttribute('width', size)

    if (text && type === 'banner') {
      text = document.createTextNode(text)
      textOverlay.setAttribute('fill', 'rgba(' +
        getRandomRange(210, 250, 1) + ',' +
        getRandomRange(210, 250, 2) + ',' +
        getRandomRange(210, 250, 3) + ',1)',
      )
      textOverlay.setAttribute('font-size', 5)
      textOverlay.setAttribute('font-weight', 'bold')
      textOverlay.setAttribute('text-anchor', 'start')
      textOverlay.setAttribute('x', 3)
      textOverlay.setAttribute('y', 4.5)
      textOverlay.appendChild(text)
    }

    if (text && type === 'profile') {
      text = document.createTextNode(initials)
      textOverlay.setAttribute('fill', 'rgba(255,255,255,1)')
      textOverlay.setAttribute('font-size', 50)
      textOverlay.setAttribute('text-anchor', 'middle')
      textOverlay.setAttribute('x', 50)
      textOverlay.setAttribute('y', 66)
      textOverlay.appendChild(text)
    }
    box.appendChild(textOverlay)
  }
  return box
}

let rootDefs

function getRootDefs () {
  if (!rootDefs) {
    let rootSVG = document.getElementById('RandomArtRootSVG')
    if (!rootSVG) {
      rootSVG = document.createElementNS(SVGNS, 'svg')
      rootSVG.setAttribute('id', 'RandomArtRootSVG')
      document.body.appendChild(rootSVG)
    }
    rootDefs = rootSVG.querySelector('defs')
    if (!rootDefs) {
      console.log('creating rootDefs...')
      rootDefs = document.createElementNS(SVGNS, 'defs')
      rootSVG.appendChild(rootDefs)
    }
  }
  return rootDefs
}

export function addDefinition (definition) {
  getRootDefs().appendChild(definition)
}
