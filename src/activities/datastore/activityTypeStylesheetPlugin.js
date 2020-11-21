/**
 * This plugin is responsible for defining some custom colors for activity types that can be
 * used in quasar components that accept a quasar palette color name.
 *
 * So, where you might put:
 *
 *   color="primary"
 *
 * You can also now put:
 *
 *   color="activity-type-5"
 *
 * The number is the database id of the activity type.
 *
 */
export default datastore => {
  const { updateActivityTypes } = createActivityTypeStylesheet()
  datastore.watch((state, getters) => getters['activityTypes/all'], updateActivityTypes, { immediate: true })
}

export function createActivityTypeStylesheet (suffix = '') {
  const defaultColour = '#FF0000'
  let stylesheet

  function getStylesheet () {
    if (!stylesheet) {
      stylesheet = document.createElement('style')
      stylesheet.type = 'text/css'
      stylesheet.innerText = ''
      document.head.appendChild(stylesheet)
    }
    return stylesheet
  }

  function updateStyles (styles) {
    getStylesheet().innerText = styles
  }

  function updateActivityTypes (activityTypes) {
    const colorNames = {} // id -> colorName
    const styles = activityTypes.map(activityType => {
      let color = activityType.colour || defaultColour
      if (color[0] !== '#') color = '#' + color
      const colorName = `activity-type-${activityType.id}${suffix}`
      colorNames[activityType.id] = colorName

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

  function removeStylesheet () {
    if (stylesheet) {
      stylesheet.remove()
    }
  }

  return {
    updateActivityTypes,
    removeStylesheet,
  }
}
