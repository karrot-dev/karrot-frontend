// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import Quasar, { AppVisibility, ClosePopup, Dialog, TouchHold } from 'quasar'

export const config = {
  plugins: {
    Dialog,
    AppVisibility,
  },
  directives: {
    ClosePopup,
    TouchHold,
  },
}

export default (Vue) => {
  Vue.use(Quasar, config)
}
