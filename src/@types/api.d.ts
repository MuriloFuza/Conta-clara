import { Transaction } from '@prisma/client'

declare global {
  export type FilteredReturn =
    | {
        data: {
          status: 'success'
          object: {
            list: Transaction[]
            balance: number
          }
        }
      }
    | {
        data: {
          status: 'error'
          error: string
        }
      }
}
