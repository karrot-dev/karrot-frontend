import { storiesOf } from '@storybook/vue'

import GroupPreviewGallery from './GroupPreviewGallery.vue'
import i18n from '@/i18n'

import { groupsMock } from '@/components/mockdata'

storiesOf('GroupPreviewGallery', module)
  .add('as gallery', () => ({
    components: { GroupPreviewGallery },
    template: '<GroupPreviewGallery :groups="groups" />',
    data () { return { groups: groupsMock } },
    i18n,
  }))
