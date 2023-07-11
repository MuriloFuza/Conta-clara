'use client'
import { NewCardForm } from '@/components/new-card-form'
import { api } from '@/libs/api'
import { useAuth } from '@clerk/nextjs'
import { useCallback, useEffect, useState } from 'react'
import CardTable from '@/components/card-table'

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

export default function CreditCard() {
  const { userId } = useAuth()
  const [cards, setCards] = useState<IModifiedCard[]>([])
  const [fetchStatus, setFetchStatus] = useState('loading')

  const fetchCards = useCallback(() => {
    api
      // eslint-disable-next-line no-undef
      .get('/card/find', {
        params: {
          userId,
        },
      })
      .then((transactionResponse) => {
        const {
          data: { data },
        } = transactionResponse

        if (data.status === 'success') {
          setCards(data.object)
          setFetchStatus('success')
        } else {
          setCards([])
          setFetchStatus('error')
        }
      })
      .catch(() => setCards([]))
  }, [userId])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  return (
    <div className="space-y-4">
      <h1 className="capitalize font-bold text-xl">Cartões de Crédito</h1>

      <div className="flex flex-1 flex-col space-y-2 overflow-hidden">
        <NewCardForm userId={userId || ''} fetchCards={fetchCards} />
        <CardTable cards={cards} fetchStatus={fetchStatus} />
      </div>
    </div>
  )
}
