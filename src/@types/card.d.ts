/* eslint-disable no-unused-vars */
declare global {
  interface IModifiedCard {
    id: string
    name: string
    limit: number
    dueDate: string
    userId: string
    statusInvoice: string
    availableLimit: number
    invoice: number
  }
}

export {}
