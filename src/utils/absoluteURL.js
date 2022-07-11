// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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
