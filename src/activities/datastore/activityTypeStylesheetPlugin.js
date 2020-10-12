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
  let stylesheet

  const defaultColour = '#FF0000'

  datastore.watch((state, getters) => getters['activityTypes/all'], activityTypes => {
    const styles = activityTypes.map(activityType => {
      let color = activityType.colour || defaultColour
      if (color[0] !== '#') color = '#' + color

      // For how to define custom colors for quasar see:
      // https://quasar.dev/style/color-palette#Adding-Your-Own-Colors
      return `
          .text-activity-type-${activityType.id} {
            color: ${color};
          }
          .bg-activity-type-${activityType.id} {
            background: ${color};
          }
        `
    }).join('\n')

    updateStyles(styles)
  }, { immediate: true })

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
}
