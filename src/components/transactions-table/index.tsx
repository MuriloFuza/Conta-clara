import { Transaction } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TransactionTableProps {
  transactions: Transaction[]
  fetchStatus: string
  isLoaded: boolean
}

export default function TransactionsTable({
  transactions,
  fetchStatus,
  isLoaded,
}: TransactionTableProps) {
  return (
    <div className="flex flex-1 min-h-[40rem] md:min-h-0 h-full overflow-auto">
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
                  {formatDistanceToNow(new Date(transaction.transaction_date), {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1>Ops... Algo deu errado!</h1>
      )}
    </div>
  )
}
