// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


import debounce from 'lodash/debounce'

const DRAFT_DEBOUNCE = 300

function draftCacheKeyFor (key) {
  return `draft:${key}`
}

export const fetchDraft = (key, orElse = null) => {
  if (window.localStorage && key !== null) {
    return window.localStorage.getItem(draftCacheKeyFor(key)) || orElse
  }
  return orElse
}

export const saveDraft = debounce((key, content) => {
  if (window.localStorage) {
    window.localStorage.setItem(draftCacheKeyFor(key), content)
  }
}, DRAFT_DEBOUNCE)

export const deleteDraft = key => {
  if (window.localStorage) {
    window.localStorage.removeItem(draftCacheKeyFor(key))
  }
}
