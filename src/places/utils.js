export function placeRoute (place) {
  return place.defaultView === 'wall' ? 'placeWall' : 'placeActivities'
}
