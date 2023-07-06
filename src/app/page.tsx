'use client'
import { NewTransactionForm } from '@/components/new-transaction-form'
import { SelectInput } from '@/components/select'
import { api } from '@/libs/api'
import { useAuth } from '@clerk/nextjs'
import { Transaction } from '@prisma/client'
import { format, formatDistanceToNow } from 'date-fns'
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
      .get<FilteredReturn>('/find/filter', {
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

      <div className="flex flex-1 h-full overflow-auto">
        {fetchStatus === 'success' && isLoaded === true ? (
          <table className="w-full flex-1 border-collapse min-w-[600px]">
            <thead className="sticky top-0">
              <tr>
                <th className="bg-neutral-800 text-left rounded-tl-lg pl-6 leading-7">
                  Descrição
                </th>
                <th className="bg-neutral-800 text-left leading-7">Valor</th>
                <th className="bg-neutral-800 text-left rounded-tr-lg pr-6 leading-7">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  className="bg-neutral-950 border-t-4 border-neutral-900"
                  key={transaction.id}
                >
                  <td className="w-3/5 p-1 pl-6 leading-relaxed">
                    {transaction.description}
                  </td>
                  <td
                    className={`p-1 leading-relaxed font-mono ${
                      transaction.type === 'debit'
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {Intl.NumberFormat('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                      signDisplay: 'always',
                    }).format(
                      transaction.type === 'debit'
                        ? -transaction.value / 100
                        : transaction.value / 100,
                    )}
                  </td>
                  <td className="p-1 pr-6 leading-relaxed">
                    {formatDistanceToNow(
                      new Date(transaction.transaction_date),
                      {
                        locale: ptBR,
                        addSuffix: true,
                      },
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h1>Ops... Algo deu errado!</h1>
        )}
      </div>
    </div>
  )
}
