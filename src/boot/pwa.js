export default ({ store: datastore }) => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later.
    datastore.commit('pwa/setInstallPrompt', e)
  })
}
