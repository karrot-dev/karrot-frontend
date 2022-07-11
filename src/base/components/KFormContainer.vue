<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

<script>
import { Platform, QCard } from 'quasar'
const Component = Platform.is.mobile ? 'div' : QCard
export default {
  functional: true,
  render (h, { data, children }) {
    if (data.class) {
      throw new Error('KFormContainer component does not support class attribute')
    }
    return h(Component, { ...data, class: ['bg-white', 'q-mb-lg', 'no-shadow', 'grey-border'] }, children)
  },
}
</script>
