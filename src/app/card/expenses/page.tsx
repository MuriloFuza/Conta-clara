'use client'
import ExpensesTable from '@/components/expenses-table'
import ExpensesForm from '@/components/new-expense-form'
import { SelectKeyInput } from '@/components/select-key'
import { api } from '@/libs/api'
import { useAuth } from '@clerk/nextjs'
import { MonthlyExpenses } from '@prisma/client'
import { useEffect, useState } from 'react'

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

        console.log(data.object)
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
  }, [])

  // Load Expenses
  useEffect(() => {
    fetchExpenses(userId || '', card)
  }, [card])

  return (
    <div className="space-y-4">
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
