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
        <q-btn style="float: right" color="primary" @click="showDetails(cell.row)" small>Info</q-btn>
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

    <q-modal ref="detailModal" :content-css="{minWidth: '50vw', minHeight: '80vh'}">
      <q-modal-layout content-style="width: 100%">
        <q-toolbar slot="header">
          <div class="q-toolbar-title">
            Details
          </div>
          <q-btn flat @click="$refs.detailModal.close()">
            <i class="fa fa-window-close-o fa-fw" style="font-size: 1.4em"/>
          </q-btn>
        </q-toolbar>
        <div style="padding: 4px; max-width: 100%; width: 100%; overflow: auto">
          <pre>{{ modalData }}</pre>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import { QBtn, QDataTable, QModal, QModalLayout, QToolbar } from 'quasar'

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
  components: { QBtn, QDataTable, ProfilePicture, QModal, QModalLayout, QToolbar },
}
</script>

<style scoped lang="stylus">
.white-background
  background-color: white
</style>
