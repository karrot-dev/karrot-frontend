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
        // Remove this handling if https://github.com/davidcalhoun/jstoxml/issues/41 gets fixed!
        _content: marker.gpx,
      }
    }),
  }, {
    header: true,
  })
}
