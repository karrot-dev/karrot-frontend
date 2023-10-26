export const karrotPlugins = []

export default async context => {
  // TODO: where do plugins *really* get loaded from?
  const pluginURL = `http://localhost:7070/index.js?v=${Date.now()}`
  const plugin = await import(pluginURL /* @vite-ignore */)
  setupPlugin(plugin.default)
  function setupPlugin (plugin) {
    if (plugin.boot) {
      plugin.boot(context)
    }
    karrotPlugins.push(plugin)
  }
}
