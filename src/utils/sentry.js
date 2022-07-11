<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
=======
import * as Sentry from '@sentry/vue'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

export function configureSentry (app, { dsn, environment }) {
  if (process.env.DEV) {
    environment = 'dev'
  }
  Sentry.init({
    app,
    dsn,
    environment,
    release: process.env.KARROT.GIT_SHA1,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded', // Chrome
      'ResizeObserver loop completed with undelivered notifications', // Firefox
    ],
  })
}
