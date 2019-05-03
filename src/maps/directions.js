function encode ({ latitude, longitude } = {}) {
  return encodeURI(`${latitude},${longitude}`)
}

const osm = (start, end) => {
  return start && start.latitude
    ? `https://www.openstreetmap.org/directions?engine=graphhopper_bicycle&from=${encode(start)}&to=${encode(end)}`
    : `https://www.openstreetmap.org/directions?engine=graphhopper_bicycle&to=${encode(end)}`
}

const apple = (end) => `http://maps.apple.com/?saddr=Current%20Location&daddr=${encode(end)}`

const google = (end) => `https://maps.google.com?saddr=Current%20Location&daddr=${encode(end)}`

export default {
  osm,
  apple,
  google,
}
