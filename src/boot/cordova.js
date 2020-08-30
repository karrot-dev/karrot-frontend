if (process.env.MODE === 'cordova') {
  require('@/utils/cordova/setBaseURL')
}

export default async function () {
  if (process.env.MODE === 'cordova') {
    // requires datastore and router
    require('@/utils/cordova')
  }
}
