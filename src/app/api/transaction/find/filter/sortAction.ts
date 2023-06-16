import { Transaction } from '@prisma/client'

type OrderBy = 'asc' | 'desc'
type SortBy = 'data' | 'value'

export function SortAction(sort: SortBy, order: OrderBy, list: Transaction[]) {
  // value asc
  list.sort(function (x, y) {
    return x.value - y.value
  })

  return list
}
