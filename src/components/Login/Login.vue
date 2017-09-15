<template>
  <div>
      <div class="header">
        <h4>Login</h4>
      </div>
      <div class="content">
        <div class="white-box shadow-1 inset-shadow">
          <q-field icon="fa-envelope">
            <q-input v-model="email" float-label="Email"/>
          </q-field>
        </div>
        <div class="white-box shadow-1 inset-shadow">
          <q-field icon="fa-lock">
            <q-input v-model="password" type="password" float-label="Password"/>
          </q-field>
        </div>
        <q-btn class="submit shadow-4">Login</q-btn>
        <div style="clear: both"/>
      </div>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'

export default {
  components: { QField, QInput, QBtn }
}
</script>

<style scoped lang="stylus">
@import '~variables'
.header
  padding 0.1em 1em
.content
  border-radius 5px
  width 100%
  min-height 5em
  background-color $primary
  color white
  padding 1em 1em
  .white-box
    background-color white
    border-radius 2px
    padding .1em 1em
    margin-bottom .5em
    .q-field
      margin-top .2em
  .submit
    float right
    background-color $secondary
  .submit:hover
    background-color $positive
</style>