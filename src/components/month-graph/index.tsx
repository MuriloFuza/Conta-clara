'use client'

import { api } from '@/libs/api'
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

interface MonthGraphInfo {
  day: Date
  credit: number
  debit: number
}

export function MonthGraph() {
  const [selectedMonth, setSelectedMonth] = useState(6)
  const [fetchStatus, setFetchStatus] = useState('')
  const [monthData, setMonthData] = useState<MonthGraphInfo[]>([])

  const fetchTransactions = useCallback(() => {
    api
      // eslint-disable-next-line no-undef
      .get<FilteredReturn>('/find/filter', {
        params: {
          month: selectedMonth,
        },
      })
      .then((transactionResponse) => {
        const {
          data: { data },
        } = transactionResponse

        if (data.status === 'success') {
          setFetchStatus('success')

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
                  accumulator[existingDayIndex].credit += transaction.value
                } else if (transaction.type === 'debit') {
                  accumulator[existingDayIndex].debit += transaction.value
                }
              } else {
                // If no record for the day exists, create a new entry
                const newEntry: MonthGraphInfo = {
                  day: transaction.transaction_date,
                  credit: transaction.type === 'credit' ? transaction.value : 0,
                  debit: transaction.type === 'debit' ? transaction.value : 0,
                }
                accumulator.push(newEntry)
              }

              return accumulator
            },
            [] as MonthGraphInfo[],
          )

          setMonthData(newMonthData)
        } else {
          setFetchStatus('error')
        }
      })
  }, [selectedMonth])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1">
        <label>Relatório por mês</label>
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
                name === 'debit' ? 'Débito' : 'Crédito',
              ]
            }}
            labelFormatter={(label) => {
              return format(new Date(label), "dd 'de' LLLL", { locale: ptBR })
            }}
          />
          <Legend
            formatter={(label) => {
              return label === 'debit' ? 'Débito' : 'Crédito'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
