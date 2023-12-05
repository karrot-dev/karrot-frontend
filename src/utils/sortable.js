import { generateKeyBetween } from 'fractional-indexing'
import { Sortable } from 'sortablejs'
import { ref, unref, watch } from 'vue'

const handleColumn = {
  name: 'handle',
  classes: 'drag-handle',
  style: 'cursor: grab !important',
}

/**
 * Table sorting, to go with a QTable
 *
 * Be sure to include this template for the handle column:
 *
 *     <template #body-cell-handle="props">
 *       <QTd
 *         :props="props"
 *         :auto-width="true"
 *       >
 *         <QIcon name="fa fa-bars" />
 *       </QTd>
 *     </template>
 *
 * We *might* run into issues, as Sortable.js is sorting the DOM elements independently of vue,
 * so if vue tries to re-render before have saved/updated, it could mess things up...
 *
 * (If that is an issue, might need to write a plugin...)
 *
 * @param rows whatever you pass to QTable as rows
 * @param onUpdate will pass you an object with { id, order } to go and save
 * @returns {{ tableRef, handleColumn }} tableRef to pass as ref to your QTable and handleColumn to include in columns
 */
export function useSortableTable ({ rows: rowsRef, onUpdate }) {
  const tableRef = ref(null)
  watch(tableRef, table => {
    const tbody = table?.$el?.querySelector('tbody')
    if (!tbody) return
    Sortable.create(tbody, {
      animation: 150,
      ghostClass: 'invisible',
      handle: '.drag-handle',
      async onEnd ({ oldIndex, newIndex }) {
        if (oldIndex === newIndex) return

        const rows = unref(rowsRef)

        // Work out our prev/next indexes
        // It is thinking we'll remove it first
        // So if moving higher we need to counter this by adding 1
        const maybeOneMore = newIndex > oldIndex ? 1 : 0
        const prevIndex = newIndex - 1 + maybeOneMore
        const nextIndex = newIndex + maybeOneMore

        // Get all our row references
        const row = rows[oldIndex]
        const prev = rows[prevIndex]
        const next = rows[nextIndex]

        // Work out the value for our next order
        const prevOrder = prev?.order || null
        let nextOrder = next?.order || null
        if (prevOrder && nextOrder && prevOrder === nextOrder) {
          // generateKeyBetween will throw an error if they are the same...
          nextOrder = null
        }
        const order = generateKeyBetween(prevOrder, nextOrder)

        await onUpdate?.({ id: row.id, order })
      },
    })
  })
  return {
    handleColumn,
    tableRef,
  }
}
