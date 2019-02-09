#!/bin/sh

function mod() {
  from=$1
  to=$2
  dir=${3:-"src test"}
  for d in $dir; do
    codemod -m --accept-all -d $d --extensions js,vue "$from" "$to"
  done
}

if [ -d src/stores ]; then
  if [ -d src/places ]; then
    echo "Have both src/stores and src/places"
    exit 1
  fi
  mv src/stores src/places
fi

mv src/maps/components/StoreMarker.vue src/maps/components/PlaceMarker.vue
mv src/history/pages/StoreHistory.vue src/history/pages/PlaceHistory.vue
mv src/pickups/components/StorePickups.vue src/pickups/components/PlacePickups.vue
mv src/places/pages/Stores.vue src/places/pages/Places.vue
mv src/places/storeStatus.js src/places/placeStatus.js
mv src/places/api/stores.js src/places/api/places.js
mv src/places/components/Store.story.js src/places/components/Place.story.js
mv src/places/components/StoreEdit.vue src/places/components/PlaceEdit.vue
mv src/places/components/StoreList.vue src/places/components/PlaceList.vue
mv src/places/datastore/stores.spec.js src/places/datastore/places.spec.js
mv src/places/datastore/index.js src/places/datastore/index.js
mv src/places/datastore/stores.js src/places/datastore/places.js
mv src/sidenav/components/StoreOptions.vue src/sidenav/components/PlaceOptions.vue
mv src/sidenav/components/StoreOptionsUI.vue src/sidenav/components/PlaceOptionsUI.vue
mv src/feedback/components/StoreFeedback.vue src/feedback/components/PlaceFeedback.vue
mv src/sidenav/components/SidenavStore.vue src/sidenav/components/SidenavPlace.vue
mv src/sidenav/components/SidenavStores.vue src/sidenav/components/SidenavPlaces.vue
mv src/sidenav/components/SidenavStoreUI.vue src/sidenav/components/SidenavPlaceUI.vue
mv src/sidenav/components/SidenavStoresUI.vue src/sidenav/components/SidenavPlacesUI.vue

mod '_store_' '_place_'
mod '_stores_' '_places_'
mod '\bstore_' 'place_'
mod '_store\b' '_place'
mod '_stores\b' '_places'
mod '\bStore\b' 'Place'
mod '([a-z])Store([A-Z])' '\1Place\2'
mod '([a-z])Store\b' '\1Place'
mod '\bStore([A-Z])' 'Place\1'
mod '\bstore([A-Z])' 'place\1'
mod '\bstores([A-Z])' 'places\1'
mod '([a-z])Stores([A-Z])' '\1Places\2'
mod '\bStores([A-Z])' 'Places\1'
mod '([a-z])Stores\b' '\1Places'
mod '\bstore\b' 'place'
mod '\bstoreStatus\b' 'placeStatus'
mod '\bstore2\b' 'place2'
mod '\bstores\b' 'places'
mod '\bStores\b' 'Places'

# Undo some over converting
mod 'Vuex.Place' 'Vuex.Store'
mod 'place: datastore' 'store: datastore'
mod '\$place' '$store'
mod 'place: createDatastore' 'store: createDatastore'
mod 'placeHelpers' 'storeHelpers'  # TODO: should really be datastoreHelpers
mod '{ placeName: place.name' '{ storeName: place.name'
mod "type = 'new_place'" "type = 'new_store'"

# Some more manual single changes
sed -i 's/place\/plugins\/i18n/base\/datastore\/i18nPlugin/g' src/base/i18n.js 
sed -i 's/cancel: \(place, groupId\)/cancel: \(_, groupId\)/g' src/applications/pages/ApplicationForm.vue
sed -i 's/So we just place whether we want them removed/So we just remember whether we want them removed/g' src/subscriptions/firebase.js
