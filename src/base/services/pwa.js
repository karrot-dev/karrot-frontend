let pwaInstallPrompt = null

export function setPwaInstallPrompt (value) {
  pwaInstallPrompt = value
}

export function getPwaInstallPrompt () {
  return pwaInstallPrompt
}

export function hasPwaInstallPrompt () {
  return Boolean(pwaInstallPrompt)
}
