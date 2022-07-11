<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import i18n from '@/base/i18n'
=======
import { i18nPlugin as i18n } from '@/base/i18n'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

export default ({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
}

export { i18n }
