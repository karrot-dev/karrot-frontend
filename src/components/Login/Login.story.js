import { storiesOf } from '@storybook/vue'

import Login from './Login.vue'
import Signup from './Signup.vue'

storiesOf('Login & Signup', module)
  .add('Login', () => ({
    components: { Login },
    template: '<div id="q-app" style="padding: 2em"><Login/></div>'
  }))

  .add('Signup', () => ({
    components: { Signup },
    template: '<div id="q-app" style="padding: 2em"><Signup/></div>'
  }))
