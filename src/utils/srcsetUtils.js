export const presets = {
  WELCOME_IMGS: 'welcomeImgs',
}

const presetsDefs = {
  [presets.WELCOME_IMGS]: {
    maxWidth: 300,
    maxWidthRetina: 600,
    possibleWidths: [100, 150, 200, 250, 300, 400, 500, 600],
    sizes: `
          (max-width: 372px) 100px,
          (max-width: 560px) 150px,
          (max-width: 599px) 200px,
          (max-width: 640px) 150px,
          (max-width: 790px) 200px,
          (max-width: 940px) 250px,
          (max-width: 1049px) 300px,
          250px
          `,
  },
}

const sliceAndSpliceSrcsetWidths = (listOfWidths, imgWidth) => {
  const maxIndex = listOfWidths.reduce(function (
    highestIndex,
    element,
    index,
    array,
  ) {
    return element > array[highestIndex] && element < imgWidth
      ? index
      : highestIndex
  },
  0)

  const srcsetWidths = listOfWidths.slice(0, maxIndex + 1)

  if (!srcsetWidths.includes(imgWidth)) {
    // insert actual image width into array
    // to generate a srcset entry for it
    srcsetWidths.splice(maxIndex + 1, 0, imgWidth)
  }

  return srcsetWidths
}

const generateSrcsetEntries = (baseFileName, basePath, entries) => {
  return entries.reduce((acc, curr, index) => {
    const divider = index < entries.length - 1 ? ', ' : ''
    const currWidth = curr.toString()
    const entry = require(`@/${basePath}${baseFileName}-${currWidth}w.jpg`) + ` ${currWidth}w`
    return acc + entry + divider
  }, '')
}

// TODO: add params description
// TODO: add usage to docs?
export const getImgSources = ({ baseFileName = '', basePath = '', physicalWidth = 0, preset = '' } = {}) => {
  if (!baseFileName || !basePath || !physicalWidth || !preset) {
    return {}
  }

  let baseWidth = presetsDefs[preset].maxWidthRetina
  const possibleWidths = presetsDefs[preset].possibleWidths
  let widths = possibleWidths

  if (physicalWidth < presetsDefs[preset].maxWidthRetina) {
    baseWidth = physicalWidth
    widths = sliceAndSpliceSrcsetWidths(possibleWidths, physicalWidth)
  }

  return {
    src: require(`@/${basePath}${baseFileName}-${baseWidth.toString()}w.jpg`),
    sizes: presetsDefs[preset].sizes,
    srcset: generateSrcsetEntries(baseFileName, basePath, widths),
  }
}
