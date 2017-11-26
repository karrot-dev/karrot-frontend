import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import GroupsGallery from './GroupsGalleryUI'
import i18n from '@/i18n'
import router from '@/router'
import { groupsMock } from '>/mockdata'

const methods = {
  preview: action('view group preview'),
  visit: action('visit group'),
}

storiesOf('GroupsGallery', module)
  .add('signup view', () => ({
    components: { GroupsGallery },
    template: '<GroupsGallery :otherGroups="otherGroups" @preview="preview" />',
    data () { return { otherGroups: groupsMock } },
    methods,
    i18n,
    router,
  }))
  .add('switch and explore', () => ({
    components: { GroupsGallery },
    template: '<GroupsGallery :myGroups="myGroups" :otherGroups="otherGroups" @preview="preview" @visit="visit" />',
    data () { return { myGroups: groupsMock.slice(0, 3), otherGroups: groupsMock } },
    methods,
    i18n,
    router,
  }))
