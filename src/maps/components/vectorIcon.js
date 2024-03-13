// A custom icon that does everything with vectors
// (the default leaflet icon uses images)
import { Icon } from 'leaflet/dist/leaflet-src.esm'

const VectorIcon = Icon.extend({
  options: {
    fontIcon: null,
    color: null,
  },
  createIcon: function (oldIcon) {
    if (oldIcon) oldIcon.remove()
    const { color, fontIcon } = this.options
    const div = document.createElement('div')
    div.innerHTML = markerHtml(color)
    div.className = 'vector-marker'

    if (fontIcon) {
      const i = document.createElement('i')
      if (fontIcon.includes('fa')) {
        // Font-awesome icon
        // Uses class names
        i.className = `${fontIcon} fa-fw`
      }
      else {
        // Material icon
        // name goes in element text
        i.className = 'material-icons'
        i.innerText = fontIcon
      }
      div.appendChild(i)
    }

    return div
  },
  createShadow: function (oldIcon) {
    if (oldIcon) oldIcon.remove()
    const div = document.createElement('div')
    const innerDiv = document.createElement('div')
    innerDiv.className = 'vector-marker-shadow'
    innerDiv.innerHTML = markerHtml('black')
    div.appendChild(innerDiv)
    return div
  },
})

function markerHtml (color) {
  return `
      <svg viewBox="0 0 33 52" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path
          d="M 16.798304,1 C 8.0719527,1 1,8.7146969 1,16.923182 1,25.134394 16.798304,51 16.798304,51 c 0,0 15.798303,-25.865606 15.798303,-34.076818 C 32.596607,8.7146969 25.520547,1 16.798304,1 Z"
          class="text-${color}"
          style="fill: currentColor"
        ></path>
      </svg>
    `
}

export default function vectorIcon (options) {
  return new VectorIcon(options)
}
