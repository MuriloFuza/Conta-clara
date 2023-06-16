import { Transaction } from '@prisma/client'

export function CalculateBalance(list: Transaction[]) {
  let calculatedBalance = 0

  list.forEach((transaction: Transaction) => {
    if (transaction.type.toLowerCase() === 'credit') {
      calculatedBalance += transaction.value
    } else {
      calculatedBalance -= transaction.value
    }
  })

  return calculatedBalance
}
