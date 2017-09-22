import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import Login from './Login.vue'
import Signup from './Signup.vue'
import i18n from '@/i18n'

const methods = {
  login: action('login'),
  signup: action('signup'),
}

storiesOf('Login & Signup', module)
  .add('Login', () => ({
    components: { Login },
    template: `<Login @submit="login" :error="null"/>`,
    i18n,
    methods,
  }))

  .add('Signup', () => ({
    components: { Signup },
    template: '<Signup @submit="signup" :status="status"/>',
    data () {
      return {
        status: { error: null, isWaiting: false },
      }
    },
    methods,
    i18n,
  }))

  .add('Signup spinning', () => ({
    components: { Signup },
    template: '<Signup @submit="signup" :status="status"/>',
    data () {
      return {
        status: { error: null, isWaiting: true },
      }
    },
    methods,
    i18n,
  }))

  .add('Signup error', () => ({
    components: { Signup },
    template: '<Signup @submit="signup" :status="status"/>',
    data () {
      return {
        status: { error: 'some error', isWaiting: false },
      }
    },
    methods,
    i18n,
  }))
