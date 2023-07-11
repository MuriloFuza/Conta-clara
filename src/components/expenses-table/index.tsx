import { api } from '@/libs/api'
import { MonthlyExpenses } from '@prisma/client'
import { CircleDollarSign, Trash } from 'lucide-react'

interface ExpensesTableProps {
  expenses: MonthlyExpenses[]
  fetchStatus: boolean
  isLoaded: boolean
  fetchExpenses: (userId: string, card: string) => void
  card: string
  userId: string
}

export default function ExpensesTable({
  expenses,
  fetchStatus,
  isLoaded,
  card,
  fetchExpenses,
  userId,
}: ExpensesTableProps) {
  const payExpense = async (expenseId: string) => {
    api
      .put('/card/expenses/pay', {
        expenseId,
      })
      .then(() => {
        fetchExpenses(userId, card)
      })
  }

  const deleteExpense = async (expenseId: string) => {
    api
      .delete('/card/expenses/delete', {
        params: {
          expenseId,
        },
      })
      .then(() => {
        fetchExpenses(userId, card)
      })
  }

  return (
    <div className="flex flex-1 h-full overflow-auto">
      {fetchStatus === true && isLoaded === true ? (
        <table className="w-full flex-1 border-collapse min-w-[600px] ">
          <thead className="sticky top-0">
            <tr>
              <th className="bg-neutral-800 text-left rounded-tl-lg pl-6 leading-7">
                Descrição
              </th>
              <th className="bg-neutral-800 text-left leading-7">Valor</th>
              <th className="bg-neutral-800 text-left leading-7">Vencimento</th>
              <th className="bg-neutral-800 text-left leading-7">Status</th>
              <th className="bg-neutral-800 rounded-tr-lg pr-6 leading-7 text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                className="bg-neutral-950 border-t-4 border-neutral-900"
                key={expense.id}
              >
                <td className="w-2/5 p-1 pl-6 leading-relaxed">
                  {expense.description}
                </td>
                <td className="w-1/5 p-1 pl-6 leading-relaxed">
                  {Intl.NumberFormat('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(expense.value / 100)}
                </td>
                <td className="w-1/5 p-1 pl-6 leading-relaxed ">
                  {new Date(expense.initialMonth).getDate()}
                </td>
                <td
                  className={`w-1/5 p-1 pl-6 leading-relaxed uppercase font-semibold ${
                    expense.payment === true ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {expense.payment === true ? 'Pago' : 'Em aberto'}
                </td>
                <td className="leading-relaxed  ">
                  <div className="flex justify-center gap-x-4 pr-4">
                    <button
                      onClick={() => {
                        payExpense(expense.id)
                      }}
                    >
                      <CircleDollarSign className="text-green-600 w-10 h-10" />
                    </button>
                    <button
                      onClick={() => {
                        deleteExpense(expense.id)
                      }}
                    >
                      <Trash className="text-red-600 w-10 h-10" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}
