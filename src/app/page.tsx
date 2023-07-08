'use client'
import { NewTransactionForm } from '@/components/new-transaction-form'
import { SelectInput } from '@/components/select'
import TransactionsTable from '@/components/transactions-table'
import { api } from '@/libs/api'
import { useAuth } from '@clerk/nextjs'
import { Transaction } from '@prisma/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useCallback, useEffect, useState } from 'react'

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [fetchStatus, setFetchStatus] = useState('loading')
  const [balance, setBalance] = useState('')
  const currentMonthName = format(new Date(), 'LLLL', { locale: ptBR }) // Junho
  const { userId, isLoaded } = useAuth()
  const [month, setMonth] = useState(
    `${currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1)}`,
  )
  const [mode, setMode] = useState('Data')
  const [order, setOrder] = useState('Decrescente')
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
  const modeList = ['Data', 'Valor']
  const orderList = ['Crescente', 'Decrescente']

  const fetchTransactions = useCallback(() => {
    const monthUsed = monthList.findIndex((mon) => mon === month) + 1
    api
      // eslint-disable-next-line no-undef
      .get<FilteredReturn>('/transaction/find/filter', {
        params: {
          month: monthUsed,
          order: order === 'Crescente' ? 'asc' : 'desc',
          sort: mode === 'Valor' ? 'value' : 'data',
          userId,
        },
      })
      .then((transactionResponse) => {
        const {
          data: { data },
        } = transactionResponse

        if (data.status === 'success') {
          setTransactions(data.object.list)
          setBalance(data.object.balance.toString())
          setFetchStatus('success')
        } else {
          setTransactions([])
          setFetchStatus('error')
        }
      })
      .catch(() => setTransactions([]))
  }, [month, order, mode])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <div className="flex flex-1 flex-col space-y-2 overflow-hidden">
      <NewTransactionForm
        fetchTransactions={fetchTransactions}
        userId={userId || ''}
      />

      <div className=" flex flex-col gap-x-8">
        <div className="flex flex-col">
          <h1 className="capitalize font-bold text-xl">{month}</h1>

          <div className="flex flex-row gap-x-2">
            <h3 className={`capitalize font-semibold text-lg `}>
              Balanço mensal:
            </h3>
            <h3
              className={`text-lg font-bold ${
                Number(balance) < 0 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              R$ {Number(balance) / 100}
            </h3>
          </div>
        </div>

        <div className="pt-3 flex flex-col">
          <h1 className="capitalize font-bold text-xl">Filtragem</h1>
          <div className="flex flex-row  gap-x-3">
            <SelectInput
              label="Mês"
              placeholder="Mês"
              selectedValue={month}
              values={monthList}
              onChange={(val) => setMonth(val)}
            />
            <SelectInput
              label="Ordenar por:"
              placeholder="Data"
              selectedValue={mode}
              values={modeList}
              onChange={(val) => setMode(val)}
            />
            <SelectInput
              label="Ordem:"
              placeholder="Decrescente"
              selectedValue={order}
              values={orderList}
              onChange={(val) => setOrder(val)}
            />
          </div>
        </div>
      </div>

      <TransactionsTable
        fetchStatus={fetchStatus}
        isLoaded={isLoaded}
        transactions={transactions}
      />
    </div>
  )
}
