/*
  This is a utility function for generating absolute URLs when they need to
  be displayed to the user or added as direct HTML hyperlinks.

  Depending on the context (web app or mobile app) we rely on different
  variables to obtain the domain for the backend.
*/

export const absoluteURL = path => {
  const origin = process.env.MODE === 'cordova' ? process.env.KARROT.BACKEND : window.location.origin
  return `${origin}${path}`
}
