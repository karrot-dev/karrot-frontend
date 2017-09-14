<template>
  <div>
    <q-data-table
      :data="history"
      :columns="columns"
    >
      <!-- Custom renderer for "message" column -->
      <template slot="col-users" scope="cell">
        <ProfilesInline :users="cell.data"/>
      </template>
      <!-- Custom renderer for "source" column -->
      <template slot="col-source" scope="cell">
        <span v-if="cell.data === 'Audit'" class="label text-white bg-primary">
          Audit
          <q-tooltip>Some data</q-tooltip>
        </span>
        <span v-else class="label text-white bg-negative">{{cell.data}}</span>
      </template>
      <!-- Custom renderer for "action" column with button for custom action -->
      <template slot='col-actions' scope='cell'>
        <q-btn color="primary" @click='doSomethingMethod(cell.row.id)' small>Info</q-btn>
      </template>
      <!-- Custom renderer when user selected one or more rows -->
      <template slot="selection" scope="selection">
        <q-btn color="primary" @click="changeMessage(selection)">
          <i>edit</i>
        </q-btn>
        <q-btn color="primary" @click="deleteRow(selection)">
          <i>delete</i>
        </q-btn>
      </template>
    </q-data-table>

  </div>
</template>

<script>
import ProfilesInline from './ProfilePictures/ProfilesInline.vue'
import { QBtn, QDataTable } from 'quasar'

export default {
  data () {
    return {
      columns: [{
        // [REQUIRED] Column name
        label: 'Date',
        // [REQUIRED] Row property name
        field: 'when',
        // [REQUIRED] Column width
        width: '100px',
        // (optional) Column CSS style
        style: {color: '#ff09fa'},
        // "style" can be a function too if you want to apply
        // certain CSS style based on cell value:
        // style (cell_value) { return .... }
        // (optional) Column CSS classes
        // (optional) Can filter/search be applied to this column?
        filter: true,
        // (optional) Sortable column?
        // If yes, then also specify `type` prop to know how to sort
        sort: false,
        format (value, row) {
          return new Date(value).toLocaleString()
        }
      }, {
        label: 'Users',
        field: 'users',
        width: '80px'
      }, {
        label: 'Event',
        field: 'event',
        width: '120px'
      }, {
        label: 'Actions',
        field: 'actions',
        width: '50px'
      }]
    }
  },
  props: {
    history: {
      required: true
    }
  },
  components: {
    QBtn, QDataTable, ProfilesInline
  }
}
</script>

<style scoped lang="stylus">
</style>