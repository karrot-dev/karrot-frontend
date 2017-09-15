import { storiesOf } from '@storybook/vue'

import Login from './Login.vue'

storiesOf('Login & Signup', module)
  .add('Login', () => ({
    components: { Login },
    template: '<div id="q-app" style="padding: 2em"><Login/></div>'
  }))
