import { useCordovaFCM } from '@/utils/cordova/setupFCM'
import { useCordovaOnlineAndFocusState } from '@/utils/cordova/setupRefresh'

import './configureUniversalLinks'

export function useCordova () {
  useCordovaFCM()
  useCordovaOnlineAndFocusState()
}
