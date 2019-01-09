import Vue from 'vue'
import conflictResolution from '@/conflictResolution/api/conflictResolution'
import router from '@/base/router'
import { withMeta, createMetaModule, metaStatuses } from '@/utils/datastore/helpers'

function initialState () {
  return {
    entries: {},
  }
}
