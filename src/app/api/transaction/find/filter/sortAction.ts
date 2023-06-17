import { Transaction } from '@prisma/client'

type OrderBy = 'asc' | 'desc'
type SortBy = 'data' | 'value'

export function SortAction(sort: SortBy, order: OrderBy, list: Transaction[]) {
  list.sort(function (x, y) {
    if (sort === 'data') {
      if (order === 'asc') {
        return x.transaction_date.getTime() - y.transaction_date.getTime()
      } else if (order === 'desc') {
        return y.transaction_date.getTime() - x.transaction_date.getTime()
      }
    } else if (sort === 'value') {
      if (order === 'asc') {
        return x.value - y.value
      } else if (order === 'desc') {
        return y.value - x.value
      }
    }

    return 0
  })

  return list
}
