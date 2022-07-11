// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


export default {
  $route: {
    query: {},
    params: {},
  },
  $router: {
    resolve: () => ({ href: '#/' }),
    // Mimic both callback and Promise API
    push: (_, onComplete) => onComplete ? {} : Promise.resolve({}),
    replace: (_, onComplete) => onComplete ? {} : Promise.resolve({}),
  },
}
