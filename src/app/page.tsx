'use client'
import { NewTransactionForm } from '@/components/new-transaction-form'
import { SelectInput } from '@/components/select'
import { api } from '@/libs/api'
import { useAuth } from '@clerk/nextjs'
import { Transaction } from '@prisma/client'
import { format, getMonth, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useCallback, useEffect, useState } from 'react'

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [fetchStatus, setFetchStatus] = useState('loading')
  const currentMonthName = format(new Date(), 'LLLL', { locale: ptBR }) // Junho
  const currentMonth = getMonth(new Date()) + 1 // 6
  const { userId, isLoaded } = useAuth()
  const [month, setMonth] = useState(
    `${currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1)}`,
  )
  const monthList = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  // DESAFIO: Impossibilitar a inserção de transações futuras (que são maiores que o dia de hoje)
  const fetchTransactions = useCallback(() => {
    api
      // eslint-disable-next-line no-undef
      .get<FilteredReturn>('/find/filter', {
        params: {
          month: currentMonth,
          userId,
        },
      })
      .then((transactionResponse) => {
        const {
          data: { data },
        } = transactionResponse

        if (data.status === 'success') {
          setTransactions(data.object.list)
          setFetchStatus('success')
        } else {
          setTransactions([])
          setFetchStatus('error')
        }
      })
  }, [currentMonth])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    setMonth(month)
  }, [month])

  return (
    <div className="flex flex-1 flex-col space-y-2 overflow-hidden">
      <NewTransactionForm
        fetchTransactions={fetchTransactions}
        userId={userId || ''}
      />

      <h1 className="capitalize font-bold text-xl">{month}</h1>
      <SelectInput
        label="Mês"
        placeholder="Mês"
        selectedValue={month}
        values={monthList}
        onChange={(val) => setMonth(val)}
      />

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
