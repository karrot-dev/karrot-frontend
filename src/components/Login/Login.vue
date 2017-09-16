<template>
  <div>
      <div class="header">
        <img :src="loginImage"></img>
        <h4>{{ $t('LOGIN.TITLE') }}</h4>
      </div>
      <div class="content" v-bind:class="{ shake: error }">
        <div class="white-box">
          <q-field icon="fa-envelope">
            <q-input :error="currentError.type == 'email'" v-model="email" :float-label="$t('USERDATA.EMAIL')"/>
          </q-field>
        </div>
        <div class="white-box">
          <q-field icon="fa-lock">
            <q-input :error="currentError.type == 'password'" v-model="password" type="password" :float-label="$t('USERDATA.PASSWORD')"/>
          </q-field>
        </div>
        <div class="error" v-if="currentError.type">
          <i class="fa fa-exclamation-triangle"/>{{ currentError.content }}
        </div>
        <div class="actions">
          <q-btn flat>{{ $t('LOGIN.FORGOT_PASSWORD') }}</q-btn>
          <router-link :to="{ name: 'signup' }"><q-btn flat>{{ $t('LOGIN.SIGNUP') }}</q-btn></router-link>
          <q-btn @click="$emit('loginDo', email, password)" class="submit shadow-4">{{ $t('LOGIN.SUBMIT') }}</q-btn>
        </div>
        <div style="clear: both"/>
      </div>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import loginImage from '@/assets/people/cherry.png'

export default {
  components: { QField, QInput, QBtn },
  data () {
    return {
      loginImage,
      isShaking: false,
      email: '',
      password: ''
    }
  },
  props: {
    error: {
      required: false
    }
  },
  computed: {
    currentError () {
      if (this.error === null) return {type: '', content: ''}
      if ('email' in this.error) return {type: 'email', content: this.error.email[0]}
      if ('password' in this.error) return {type: 'password', content: this.error.password[0]}
      return {type: 'nonField', content: this.error.non_field_errors[0]}
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~variables'
.header
  padding 0.1em 1em
  img
    height 40px
    vertical-align middle
    margin-bottom: 20px
    margin-right: 10px
  img, h4
    display inline-block
  h4
    color $primary
.content
  border-radius $borderRadius
  width 100%
  min-height 5em
  background-color $primary
  color white
  padding 1em 1em
  .white-box
    background-color white
    border-radius $borderRadiusSmall
    padding .1em 1em
    margin-bottom .5em
    .q-field
      margin-top .2em
  .error
    color $warning
    margin 0 1em
    .fa
      margin-right .5em
  .actions
    float right
    color $tertiary
    .submit
      color white
      background-color $secondary
    .submit:hover
      background-color $positive
.shake
  animation shake 0.82s cubic-bezier(.36, .07, .19, .97) both
  transform translate3d(0, 0, 0)
  backface-visibility hidden
  perspective 1000px

@keyframes shake
  10%, 90%
    transform translate3d(-1px, 0, 0)
  20%, 80%
    transform translate3d(2px, 0, 0)
  30%, 50%, 70%
    transform translate3d(-4px, 0, 0)
  40%, 60%
    transform translate3d(4px, 0, 0)
</style>