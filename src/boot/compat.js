// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


// eslint-disable-next-line
import { configureCompat } from 'vue'

// for compatibility with vue-croppa
// can be deleted once vue-croppa supports vue 3 or we don't use it anymore
// see https://github.com/zhanziyang/vue-croppa/issues/235
// also check quasar.conf.js

configureCompat({
  MODE: 3,
})

export default ({ app }) => {
  // TODO: should be able to remove this with vue v3.3.x
  app.config.unwrapInjectedRef = true
}
