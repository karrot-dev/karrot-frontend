import { markRaw } from 'vue'

import axios from '@/base/api/axios'
import { camelizeKeys } from '@/utils/utils'

export const karrotPlugins = []
const slotComponents = {}

async function listPlugins () {
  try {
    return camelizeKeys((await axios.get('/api/plugins/')).data)
  }
  catch (err) {
    console.error(err)
    return []
  }
}

export default async context => {
  await loadLocalPlugins()
  await loadServerPlugins()

  /**
   * Supports "local plugins" which is intended to support frontend plugin
   * development against any version of karrot, even deployed ones in production
   *
   * This is enabled by setting a localStorage value using the console, e.g.:
   *
   *    localStorage.setItem('KARROT_PLUGINS_LOCAL', 'http://localhost:5173/index.js')
   *
   *  On reloading the browser it'll attempt to load from that URL.
   *
   *  "http://localhost:5173" is the default address when running a vite app in dev mode.
   *
   *  It does *not* support loading plugins that have been bundled
   *  They must be installed in the backend. It could be implemented here, but hasn't yet.
   *
   *  You could use it to load a simple bundled plugin where everything is in the js entrypoint.
   */
  async function loadLocalPlugins () {
    const localPlugins = localStorage.getItem('KARROT_PLUGINS_LOCAL')
    if (localPlugins) {
      console.log('using local plugins')
      for (const localPluginURL of localPlugins.split(',').map(v => v.trim())) {
        console.log('importing local plugin from', localPluginURL)
        try {
          await setupPlugin(await import(localPluginURL))
        }
        catch (error) {
          console.error(`failed to load local plugin from ${localPluginURL}`)
        }
      }
    }
  }

  /**
   * These are the normal plugins. Installed on the server.
   *
   * The server returns a nice object that contains CSS entries + a js entrypoint
   */
  async function loadServerPlugins () {
    const plugins = await listPlugins()

    for (const { name, entry, cssEntries } of plugins) {
      const stylesheets = []
      try {
        // Import CSS
        if (cssEntries) {
          for (const cssEntry of cssEntries) {
            const stylesheet = document.createElement('link')
            stylesheet.href = cssEntry
            stylesheet.rel = 'stylesheet'
            document.head.appendChild(stylesheet)
            stylesheets.push(stylesheet)
          }
        }

        // Import and set up main entry
        await setupPlugin(await import(entry /* @vite-ignore */))
      }
      catch (err) {
        console.error(`failed to load plugin ${name}`, err)
        // Cleanup in case of error
        for (const stylesheet of stylesheets) {
          document.head.removeChild(stylesheet)
        }
      }
    }
  }

  async function setupPlugin (plugin) {
    if ('default' in plugin) {
      plugin = plugin.default
    }
    if (plugin.boot) {
      plugin.boot(context)
    }

    if (plugin.slots) {
      for (const name of Object.keys(plugin.slots)) {
        const entries = slotComponents[name] ?? (slotComponents[name] = [])
        const component = plugin.slots[name]
        entries.push(resolvableComponent(component))
      }
    }

    karrotPlugins.push(plugin)
  }
}

export async function getPluginSlotComponents (name) {
  if (name in slotComponents) {
    const entries = await Promise.all(slotComponents[name].map(fn => fn()))
    return entries.filter(Boolean).map(markRaw)
  }
  return []
}

function resolvableComponent (def) {
  let resolved

  async function resolve () {
    /* The definition can be a function
       ... which can give us a promise
       ... which can import a module with a .default
       And might also throw an error, from which we return null
     */
    try {
      let component = def
      if (typeof component === 'function') {
        component = await component()
        if ('default' in component) {
          component = component.default
        }
      }
      return component
    }
    catch (err) {
      console.log('could not resolve plugin slot component', def, err)
      return null
    }
  }

  return async () => {
    if (resolved) return resolved
    resolved = await resolve()
    return resolved
  }
}
