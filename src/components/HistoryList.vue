<template>
  <div class="white-background desktop-margin">
    <q-data-table
      :data="history"
      :columns="columns"
      :config="config"
    >
      <template slot="col-users" slot-scope="cell">
        <ProfilePicture
          v-for="user in cell.data" :key="user.id"
          :user="user"
        />
      </template>
      <template slot="col-actions" slot-scope="cell">
        <q-btn color="primary" @click="showDetails(cell.row)" small>Info</q-btn>
      </template>
    </q-data-table>
    <q-btn style="width: 100%" color="primary" @click="$emit('more')" :disabled="!canLoadMore" loader :value="status.isWaiting">
      <span v-if="canLoadMore">
        {{ $t('HISTORY.LOAD_MORE') }}
      </span>
      <span v-else>
        {{ $t('HISTORY.ALL_LOADED') }}
      </span>
    </q-btn>
    <pre v-if="status.error">{{ status.error }}</pre>

    <q-modal ref="detailModal" :content-css="{padding: '50px', minWidth: '50vw'}">
      <span class="caption text-italic">still in development</span>
      <h4>Details</h4>
      <pre>{{ modalData }}</pre>
      <q-btn color="primary" @click="$refs.detailModal.close()">Close</q-btn>
    </q-modal>
  </div>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture.vue'
import { QBtn, QDataTable, QModal } from 'quasar'

export default {
  data () {
    return {
      columns: [{
        // [REQUIRED] Column name
        label: 'Date',
        // [REQUIRED] Row property name
        field: 'date',
        // [REQUIRED] Column width
        width: '70px',
        // (optional) Column CSS style
        style: {color: '#ff09fa'},
        // "style" can be a function too if you want to apply
        // certain CSS style based on cell value:
        // style (cell_value) { return .... }
        // (optional) Column CSS classes
        classes: 'text-primary',
        // (optional) Can filter/search be applied to this column?
        filter: false,
        // (optional) Sortable column?
        // If yes, then also specify `type` prop to know how to sort
        sort: false,
        format: (value, row) => {
          return this.$d(new Date(value), 'long')
        },
      }, {
        label: 'Users',
        field: 'users',
        width: '20px',
      }, {
        label: 'Event',
        field: 'message',
        width: '200px',
      }, {
        label: 'Actions',
        field: 'actions',
        width: '50px',
      }],
      config: {
        refresh: false,
        noHeader: true,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        bodyStyle: {
          // maxHeight: '500px',
        },
        // rowHeight: '50px',
        responsive: true,
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500],
        },
      },
      modalData: null,
    }
  },
  props: {
    history: { required: true },
    status: { required: true },
    canLoadMore: { required: true },
  },
  methods: {
    showDetails (entry) {
      this.modalData = entry
      this.$refs.detailModal.open()
    },
  },
  components: { QBtn, QDataTable, ProfilePicture, QModal },
}
</script>

<style scoped lang="stylus">
.white-background
  background-color: white
</style>
