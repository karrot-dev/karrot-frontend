import { createEventModule } from '@/pickups/datastore/helpers'
import meetingAPI from '@/pickups/api/meetings'

const module = createEventModule({
  api: meetingAPI,
})

export default module
