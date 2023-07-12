'use client'
import { api } from '@/libs/api'
import { useAuth } from '@clerk/nextjs'
import { MonthlyExpenses } from '@prisma/client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
const ExpensesForm = dynamic(
  () => import('@/components/new-expense-form').then((mod) => mod.default),
  { ssr: false },
)
const ExpensesTable = dynamic(
  () => import('@/components/expenses-table').then((mod) => mod.default),
  { ssr: false },
)

const SelectKeyInput = dynamic(
  () => import('@/components/select-key').then((mod) => mod.SelectKeyInput),
  { ssr: false },
)

export default function Expenses() {
  const { userId, isLoaded } = useAuth()
  const [cards, setCards] = useState<{
    [key: string]: string
  }>({})
  const [card, setCard] = useState('')
  const [expenses, setExpenses] = useState<MonthlyExpenses[]>([])
  const [statusFetchExpenses, setStatusFetchExpenses] = useState(false)

  const fetchExpenses = (userId: string, card: string) => {
    if (card !== '') {
      api
        .get('/card/expenses/find', {
          params: {
            userId,
            cardId: card,
          },
        })
        .then((response) => {
          const { data } = response
          setExpenses(data.object)
          setStatusFetchExpenses(true)
        })
    }
  }

  // Load Cards
  useEffect(() => {
    api
      .get('/card/find', {
        params: {
          userId,
        },
      })
      .then((cardsResponse) => {
        const {
          data: { data },
        } = cardsResponse

        if (data.status === 'success') {
          let list = {}

          data.object.forEach((item: { id: string; name: string }) => {
            list = {
              ...list,
              ...{ [item.id]: item.name },
            }
          })
          setCards(list)
        }
      })
      .catch(() => setCards({}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load Expenses
  useEffect(() => {
    fetchExpenses(userId || '', card)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card])

  return (
    <div className="space-y-4 overflow-auto md:overflow-hidden">
      <h1 className="capitalize font-bold text-xl">Fatura dos Cartões</h1>
      <div className="flex flex-col gap-1">
        <SelectKeyInput
          label="Cartões"
          placeholder="cartão"
          selectedValue={card}
          values={cards}
          onChange={(val) => setCard(val)}
        />
      </div>
      {card !== '' ? (
        <ExpensesForm
          fetchExpenses={fetchExpenses}
          userId={userId || ''}
          card={card}
        />
      ) : null}
      <ExpensesTable
        expenses={expenses}
        fetchStatus={statusFetchExpenses}
        fetchExpenses={fetchExpenses}
        userId={userId || ''}
        card={card}
        isLoaded={isLoaded}
      />
    </div>
  )
}
