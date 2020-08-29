export default async ({ app }) => {
  // makes it easier to remote debug vue in cordova
  // for example to access vuex, type this into the console
  // window.vueRoot.$store.state
  window.vueRoot = app
}
