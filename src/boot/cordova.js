if (import.meta.env.MODE === 'cordova') {
  require('@/utils/cordova/setBaseURL')
}

export default async function () {
  if (import.meta.env.MODE === 'cordova') {
    // requires datastore and router
    require('@/utils/cordova')
  }
}
