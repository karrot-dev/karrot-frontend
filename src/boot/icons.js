<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import Vue from 'vue'
import { IconPlugin } from '@/base/icons'
=======
import icons from '@/base/icons'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

export default ({ app }) => {
  app.config.globalProperties.$icon = icons.get
}
