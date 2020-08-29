import { sync } from 'vuex-router-sync'

export default async function ({ store: datastore, router }) {
  sync(datastore, router)
}
