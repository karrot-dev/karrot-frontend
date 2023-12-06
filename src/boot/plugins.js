import axios from '@/base/api/axios'
import { camelizeKeys } from '@/utils/utils'

export const karrotPlugins = []

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
      setupPlugin(await import(entry))
    }
    catch (err) {
      console.error(`failed to load plugin ${name}`, err)
    }
  }

  function setupPlugin (plugin) {
    if ('default' in plugin) {
      plugin = plugin.default
    }
    if (plugin.boot) {
      plugin.boot(context)
    }
    karrotPlugins.push(plugin)
  }
}
