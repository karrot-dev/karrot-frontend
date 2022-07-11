// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import i18n from '@/base/i18n'

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n
}

export { i18n }
