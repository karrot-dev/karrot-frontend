import { groupMarker } from './components/markers'
import { makeGroup } from '>/enrichedFactories'

import { markersAsGPX } from './export'

describe('map export', () => {
  it('creates GPX', async () => {
    const marker = groupMarker(makeGroup({ name: 'foobar' }))
    expect(markersAsGPX([marker])).toBe(`
        <?xml version="1.0" encoding="UTF-8"?>
        <gpx version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
          <wpt lat="0" lon="0">
            <name>foobar</name>
            <type>groups</type>
          </wpt>
        </gpx>
      `.trim().replace(/\s*\n\s*/g, ''),
    )
  })

  it('escapes content correctly', () => {
    const marker = groupMarker(makeGroup({ name: 'foo & bar' }))
    expect(markersAsGPX([marker])).toBe(`
        <?xml version="1.0" encoding="UTF-8"?>
        <gpx version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
          <wpt lat="0" lon="0">
            <name>foo &amp; bar</name>
            <type>groups</type>
          </wpt>
        </gpx>
      `.trim().replace(/\s*\n\s*/g, ''),
    )
  })
})
