import { colors } from 'quasar'

const { getPaletteColor } = colors

// We provide a limited palette of colours to choose from that we think will look nice
// See https://quasar.dev/style/color-palette#Color-List
const names = [
  'red',
  'pink',
  'purple',
  'indigo',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'yellow',
  'amber',
  'deep-orange',
  'brown',
  'blue-grey',
]

const shades = [
  4,
  6,
  8,
  10,
]

// Quasar warns that "getPaletteColor" is quite expensive function to call, putting it here means it's only called
// once for the whole module when it's first loaded (which would be async hopefully), not once per form
export const rows = shades.map(number => names.map(name => [name, number].join('-')).map(name => ({ name, hex: getPaletteColor(name) })))

export const defaultColour = getPaletteColor('blue-grey-10')
