import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupGallery from './GroupGalleryUI'
import i18n from '@/i18n'
import router from '@/router'
import { groupsMock } from '>/mockdata'

const methods = {
  preview: action('view group preview'),
  visit: action('visit group'),
}

storiesOf('GroupGallery', module)
  .add('signup view', () => ({
    components: { GroupGallery },
    template: '<GroupGallery :otherGroups="otherGroups" @preview="preview" />',
    data () { return { otherGroups: groupsMock } },
    methods,
    i18n,
    router,
  }))
  .add('switch and explore', () => ({
    components: { GroupGallery },
    template: '<GroupGallery :myGroups="myGroups" :otherGroups="otherGroups" @preview="preview" @visit="visit" />',
    data () { return { myGroups: groupsMock.slice(0, 3), otherGroups: groupsMock } },
    methods,
    i18n,
    router,
  }))
