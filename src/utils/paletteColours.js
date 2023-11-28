import { colors } from 'quasar'

const { getPaletteColor } = colors

// We provide a limited palette of colours to choose from that we think will look nice
// See https://quasar.dev/style/color-palette#Color-List
const COLOUR_NAMES = [
  'pink',
  'purple',
  'indigo',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'amber',
  'deep-orange',
  'blue-grey',
]

const COLOUR_SHADES = [
  8,
  9,
  10,
]

// For the colour picker we need to provide a flat array with all the colours and shades
// Quasar warns that "getPaletteColor" is quite expensive function to call, putting it here means it's only called
// once for the whole module when it's first loaded (which would be async hopefully), not once per form
const PALETTE_COLOURS = COLOUR_SHADES.flatMap(number => COLOUR_NAMES.map(name => getPaletteColor(`${name}-${number}`)))

export const defaultColour = getPaletteColor('blue-grey-10')

export default PALETTE_COLOURS
