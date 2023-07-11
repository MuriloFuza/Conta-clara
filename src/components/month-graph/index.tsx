'use client'

import { api } from '@/libs/api'
import { useAuth } from '@clerk/nextjs'
import { format, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useCallback, useEffect, useState } from 'react'
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SelectKeyInput } from '../select-key'

interface MonthGraphInfo {
  day: Date
  credit?: number
  debit?: number
  card?: number
}

export function MonthGraph() {
  const currentMonthName = format(new Date(), 'LLLL', { locale: ptBR })
  const monthList = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]
  const [selectedMonth, setSelectedMonth] = useState(
    monthList.findIndex(
      (mon) =>
        mon ===
        currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1),
    ) + 1,
  )
  const [monthData, setMonthData] = useState<MonthGraphInfo[]>([])
  const { userId } = useAuth()
  const [cards, setCards] = useState<{
    [key: string]: string
  }>({})
  const [card, setCard] = useState('')

  const fetchTransactions = useCallback(() => {
    api
      // eslint-disable-next-line no-undef
      .get<FilteredReturn>('/transaction/find/filter', {
        params: {
          month: selectedMonth,
          userId,
        },
      })
      .then((transactionResponse) => {
        const {
          data: { data },
        } = transactionResponse

        if (data.status === 'success') {
          const newMonthData = data.object.list.reduce(
            (accumulator, transaction) => {
              const existingDayIndex = accumulator.findIndex((item) =>
                isSameDay(
                  new Date(item.day),
                  new Date(transaction.transaction_date),
                ),
              )

              if (existingDayIndex !== -1) {
                // If a record for the day already exists, update the credit and debit values
                if (transaction.type === 'credit') {
                  /* @ts-ignore */
                  accumulator[existingDayIndex].credit += transaction.value
                } else if (transaction.type === 'debit') {
                  /* @ts-ignore */
                  accumulator[existingDayIndex].debit += transaction.value
                }
              } else {
                // If no record for the day exists, create a new entry
                const newEntry: MonthGraphInfo = {
                  day: transaction.transaction_date,
                  credit: transaction.type === 'credit' ? transaction.value : 0,
                  debit: transaction.type === 'debit' ? transaction.value : 0,
                  card: 0,
                }
                accumulator.push(newEntry)
              }

              return accumulator
            },
            [] as MonthGraphInfo[],
          )
          setMonthData(newMonthData)
        }
      })
  }, [selectedMonth])

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
          console.log(monthData)
          if (data.status === 'success') {
            const zeroCards = monthData.map((item) => ({
              ...item,
              card: 0,
            }))
            setMonthData(zeroCards)

            const newMonthData = data.object.reduce(
              (
                accumulator: MonthGraphInfo[],
                expense: { initialMonth: string | number | Date; value: any },
              ) => {
                const existingDayIndex = accumulator.findIndex(
                  (item: { day: string | number | Date }) =>
                    isSameDay(
                      new Date(item.day),
                      new Date(expense.initialMonth),
                    ),
                )

                if (existingDayIndex !== -1) {
                  // If a record for the day already exists, update the credit and debit values
                  accumulator[existingDayIndex].card += expense.value
                } else {
                  // If no record for the day exists, create a new entry
                  const newEntry: MonthGraphInfo = {
                    /* @ts-ignore */
                    day: new Date(expense.initialMonth).toISOString(),
                    card: expense.value,
                  }
                  accumulator.push(newEntry)
                }

                return accumulator
              },
              [] as MonthGraphInfo[],
            )

            const updatedMonthData = [...monthData]
            /* @ts-ignore */
            newMonthData.forEach((newExpense) => {
              const existingDayIndex = updatedMonthData.findIndex((item) =>
                isSameDay(new Date(item.day), new Date(newExpense.day)),
              )

              if (existingDayIndex !== -1) {
                // If a record for the day already exists, update the card value
                if (
                  typeof updatedMonthData[existingDayIndex].card !== 'number'
                ) {
                  updatedMonthData[existingDayIndex].card = newExpense.card
                } else {
                  updatedMonthData[existingDayIndex].card += newExpense.card
                }
              } else {
                // If no record for the day exists, add a new entry
                if (newExpense.debit || newExpense.credit) {
                  const newEntry: MonthGraphInfo = {
                    day: newExpense.day,
                    card: newExpense.card,
                  }
                  updatedMonthData.push(newEntry)
                } else {
                  const newEntry: MonthGraphInfo = {
                    day: newExpense.day,
                    credit: 0,
                    debit: 0,
                    card: newExpense.card,
                  }
                  updatedMonthData.push(newEntry)
                }
              }
            })
            const sortedMonthData = [...updatedMonthData].sort((a, b) => {
              const dateA = new Date(a.day).getTime()
              const dateB = new Date(b.day).getTime()
              return dateB - dateA
            })
            setMonthData(sortedMonthData)
          }
        })
    }
  }

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
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    fetchExpenses(userId || '', card)
  }, [card])

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1 gap-y-4">
        {Object.keys(cards).length > 0 ? (
          <SelectKeyInput
            label="Cartões"
            placeholder="cartão"
            selectedValue={card}
            values={cards}
            onChange={(val) => setCard(val)}
          />
        ) : null}
        <select
          className="h-10 capitalize focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-600 rounded-lg p-2 pr-8 border-0 bg-neutral-950 outline-none"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
            <option className="capitalize" key={month} value={month}>
              {format(new Date(2023, month - 1), 'LLLL', { locale: ptBR })}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={monthData}>
          {/* @ts-ignore */}
          <XAxis
            dataKey="day"
            tickFormatter={(value) =>
              format(new Date(value), 'dd', { locale: ptBR })
            }
          />
          <YAxis
            tickFormatter={(value) => (value / 100) as unknown as string}
          />
          <Line type="monotone" dataKey="debit" stroke="#f87171" />
          <Line type="monotone" dataKey="credit" stroke="#4ade80" />
          <Line type="monotone" dataKey="card" stroke="#2c2cdb" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#171717',
            }}
            formatter={(value, name, props) => {
              return [
                Intl.NumberFormat('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(value) / 100),
                name === 'debit'
                  ? 'Débito'
                  : name === 'credit'
                  ? 'Crédito'
                  : 'Cartão',
              ]
            }}
            labelFormatter={(label) => {
              return format(new Date(label), "dd 'de' LLLL", { locale: ptBR })
            }}
          />
          <Legend
            formatter={(label) => {
              return label === 'debit'
                ? 'Débito'
                : label === 'credit'
                ? 'Crédito'
                : 'Cartão'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
