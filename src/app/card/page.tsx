'use client'
import { NewCardForm } from '@/components/new-card-form'
import { api } from '@/libs/api'
import { useAuth } from '@clerk/nextjs'
import { useCallback, useEffect, useState } from 'react'
import { Card } from '@prisma/client'

export default function CreditCard() {
  const { userId } = useAuth()
  const [cards, setCards] = useState<Card[]>([])
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

        <div className="flex flex-1 h-full overflow-auto">
          {fetchStatus === 'success' ? (
            <table className="w-full flex-1 border-collapse min-w-[600px]">
              <thead className="sticky top-0">
                <tr>
                  <th className="bg-neutral-800 text-left rounded-tl-lg pl-6 leading-7">
                    Nome
                  </th>
                  <th className="bg-neutral-800 text-left leading-7">Limite</th>
                  <th className="bg-neutral-800 text-left leading-7">
                    Limite disponível
                  </th>
                  <th className="bg-neutral-800 text-left leading-7">
                    Vencimento
                  </th>
                  <th className="bg-neutral-800 text-left rounded-tr-lg pr-6 leading-7">
                    Fatura atual
                  </th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr
                    className="bg-neutral-950 border-t-4 border-neutral-900"
                    key={card.id}
                  >
                    <td className="w-2/5 p-1 pl-6 leading-relaxed">
                      {card.name}
                    </td>
                    <td className={`p-1 leading-relaxed font-mon`}>
                      {Intl.NumberFormat('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                        signDisplay: 'always',
                      }).format(card.limit / 100)}
                    </td>
                    <td className="p-1 pr-6 leading-relaxed">0</td>
                    <td className="p-1 pr-6 leading-relaxed items-center">
                      {card.dueDate}
                    </td>
                    <td className="p-1 pr-6 leading-relaxed">0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </div>
  )
}
