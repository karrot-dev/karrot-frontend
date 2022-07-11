<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT





import Vue from 'vue'
=======
import { reactive } from 'vue'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import iconsData from './icons.json'

const state = reactive({
  iconStore: {
    ...iconsData,
  },
})

export default {
  get (name) {
    return state.iconStore[name]
  },
  getAll () {
    return state.iconStore
  },
  set (value) {
    state.iconStore = { ...value }
  },
  reset () {
    state.iconStore = { ...iconsData }
  },
}
