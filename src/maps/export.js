import { toXML } from 'jstoxml'
import { saveAs } from 'file-saver'

export function exportAsGPX (markers, filename) {
  saveAs(new Blob(
    [markersAsGPX(markers)],
    {
      type: 'application/gpx+xml',
    },
  ), filename)
}

export function markersAsGPX (markers) {
  return toXML({
    _name: 'gpx',
    _attrs: {
      version: '1.1',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd',
    },
    _content: markers.map(marker => {
      const { lat, lng: lon } = marker.latLng
      return {
        _name: 'wpt',
        _attrs: {
          lat,
          lon,
        },
        _content: escapeObject(marker.gpx),
      }
    }),
  }, {
    header: true,
  })
}

// Only escapes top level values and assumes they are strings
function escapeObject (obj) {
  const newObj = {}
  for (const key of Object.keys(obj)) {
    newObj[key] = escapeValue(obj[key])
  }
  return newObj
}

function escapeValue (content) {
  return content.replace(/[<>&"']/g, c => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
  }[c]))
}
