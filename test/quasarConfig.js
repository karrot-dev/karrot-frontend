// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import { AppVisibility, ClosePopup, Dialog, TouchHold } from 'quasar'

export default {
  plugins: {
    Dialog,
    AppVisibility,
  },
  directives: {
    ClosePopup,
    TouchHold,
  },
}
