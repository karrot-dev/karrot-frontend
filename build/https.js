/* eslint-env node */

const { spawnSync } = require('child_process')
const { existsSync, readFileSync } = require('fs')
const { join, resolve } = require('path')

const BASE_DIR = resolve(__dirname, '..')

module.exports = { getHttpsOptions }

/**
 * If you're using pwa, it's best to use https.
 *
 * Install mkcert locally on your system and we will automatically generate
 * a local key and cert for you in build/dev-certs.
 *
 * See https://github.com/FiloSottile/mkcert
 *
 * Alternatively, you can also supply env variables KEY, CERT, and CA if you prefer.
 *
 */
function getHttpsOptions () {
  const mkcertRootCAFilename = join(require('os').homedir(), '.local/share/mkcert/rootCA.pem')
  const keyFilename = process.env.KEY || join(BASE_DIR, 'build/dev-certs/key.pem')
  const certFilename = process.env.CERT || join(BASE_DIR, 'build/dev-certs/cert.pem')
  const caFilename = process.env.CA || mkcertRootCAFilename
  const all = [keyFilename, certFilename, caFilename]
  const missing = all.filter(filename => !existsSync(filename))
  if (missing.length > 0) {
    if (existsSync(mkcertRootCAFilename)) {
      // Try and create the others, given it looks like mkcert is here :)
      const res = spawnSync('mkcert', ['-key-file', keyFilename, '-cert-file', certFilename, 'localhost'])
      if (res.stdout) {
        console.log(res.stdout.toString())
      }
      if (res.stderr) {
        console.log(res.stderr.toString())
      }
      if (res.status !== 0) {
        throw new Error('Failed to create cert with mkcert')
      }
    }
    else {
      console.log(`Could not find key/cert/ca files ${missing.join(', ')}, falling back to our own...`)
      return true
    }
  }
  console.log('Using https with:')
  console.log('   Key :', keyFilename)
  console.log('  Cert :', certFilename)
  console.log('    CA :', caFilename)
  console.log()
  return {
    key: readFileSync(keyFilename),
    cert: readFileSync(certFilename),
    ca: readFileSync(caFilename),
  }
}
