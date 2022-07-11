<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import Vue from 'vue'
=======
import { reactive } from 'vue'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import { Platform, throttle, dom } from 'quasar'
const { height, width } = dom
import { ready } from '@/utils/utils'

const getSize = () => height(window) + width(window)

const size = {
  original: null,
  current: null,
}

ready(() => { size.original = getSize() })

const state = reactive({
  is: {
    open: false,
  },
})

if (Platform.is.mobile) {
  ready(() => {
    window.addEventListener('resize', throttle(() => {
      // if the window is >150px smaller than original, we guess it's the keyboard...
      state.is.open = (size.original - getSize()) > 150
    }, 100))
  })
}

export default state
