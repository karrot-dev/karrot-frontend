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
  const plugins = await listPlugins()

  for (const { name, entry, cssEntries } of plugins) {
    try {
      // Import CSS
      if (cssEntries) {
        for (const cssEntry of cssEntries) {
          const stylesheet = document.createElement('link')
          stylesheet.href = cssEntry
          stylesheet.rel = 'stylesheet'
          document.head.appendChild(stylesheet)
        }
      }

      // Import and set up main entry
      await setupPlugin(await import(entry /* @vite-ignore */))
    }
    catch (err) {
      console.error(`failed to load plugin ${name}`, err)
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
    return entries.filter(Boolean)
  }
  return []
}

function resolvableComponent (def) {
  let resolved

  async function resolve () {
    // The definition can be a function
    // Which can give us a promise
    // Which can import a module with .default
    // And can also throw an error, in which case we resolve null
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
