/**
 * This plugin is responsible for defining some custom colors for any entries that have
 * a colour so they can be used in quasar components that accept a quasar palette color name.
 *
 * So, where you might put:
 *
 *   color="primary"
 *
 * You can also now put:
 *
 *   color="my-suffix-5"
 *
 * The number is the database id of the entry.
 *
 */
import { computed, onUnmounted, ref, unref } from 'vue'

let nextId = 0

function idFor (entry) {
  if (typeof entry.id !== 'undefined') {
    return entry.id
  }
  else {
    return `new-${nextId++}`
  }
}

function randomStyleSheetPrefix () {
  return Math.random().toString(20).slice(2, 6) + '-'
}

/**
 * Useful when editing something, and you want a one-off colour name
 *
 * @param entry something with a "colour" property
 * @returns a quasar colour name
 */
export function useColourNameFor (entry) {
  const { updateEntry, removeStylesheet } = createStylesheet(randomStyleSheetPrefix())

  onUnmounted(() => removeStylesheet())

  return computed(() => updateEntry(unref(entry)))
}

export function createActivityTypeStylesheet (suffix = '') {
  return createStylesheet('activity-type-', suffix)
}

export function createPlaceStatusStylesheet (suffix = '') {
  return createStylesheet('place-status-', suffix)
}

export function createStylesheet (prefix = '', suffix = '', defaultColour) {
  let stylesheet

  function getStylesheet () {
    if (!stylesheet) {
      stylesheet = new CSSStyleSheet()
      document.adoptedStyleSheets = [
        ...document.adoptedStyleSheets,
        stylesheet,
      ]
    }
    return stylesheet
  }

  function updateStyles (styles) {
    getStylesheet().replaceSync(styles)
  }

  function updateEntries (entries = []) {
    const colorNames = []
    const styles = entries.map(entry => {
      let color = entry.colour || defaultColour
      if (!color) return ''
      if (color[0] !== '#') color = '#' + color
      const colorName = `${prefix}${idFor(entry)}${suffix}`
      colorNames.push(colorName)

      // For how to define custom colors for quasar see:
      // https://quasar.dev/style/color-palette#Adding-Your-Own-Colors
      return `
          .text-${colorName} {
            color: ${color};
          }
          .bg-${colorName} {
            background: ${color};
          }
        `
    }).join('\n')

    updateStyles(styles)

    return colorNames
  }

  function updateEntry (entry) {
    return updateEntries([entry])[0]
  }

  function removeStylesheet () {
    if (stylesheet) {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(s => s !== stylesheet)
    }
  }

  return {
    updateEntries,
    updateEntry,
    removeStylesheet,
  }
}
