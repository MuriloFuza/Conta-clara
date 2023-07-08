interface IModifiedCard {
  id: string
  name: string
  limit: number
  dueDate: string
  userId: string
  statusInvoice: string
  availableLimit: number
  invoice: number
}

interface CardTableProps {
  cards: IModifiedCard[]
  fetchStatus: string
}

export default function CardTable({ cards, fetchStatus }: CardTableProps) {
  return (
    <div className="flex flex-1 h-full overflow-auto">
      {fetchStatus === 'success' ? (
        <table className="w-full flex-1 border-collapse min-w-[600px]">
          <thead className="sticky top-0">
            <tr>
              <th className="bg-neutral-800 text-left rounded-tl-lg pl-6 leading-7">
                Nome
              </th>
              <th className="bg-neutral-800 text-center leading-7">Limite</th>
              <th className="bg-neutral-800 text-center leading-7">
                Limite disponível
              </th>
              <th className="bg-neutral-800 text-center leading-7">
                Vencimento
              </th>
              <th className="bg-neutral-800 text-center leading-7">
                Fatura atual
              </th>
              <th className="bg-neutral-800 text-center rounded-tr-lg pr-6 leading-7">
                Status da fatura
              </th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr
                className="bg-neutral-950 border-t-4 border-neutral-900"
                key={card.id}
              >
                <td className="w-1/5 p-1 pl-6 leading-relaxed">{card.name}</td>
                <td className={`p-1 leading-relaxed text-center font-mon`}>
                  {Intl.NumberFormat('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(card.limit / 100)}
                </td>
                <td className="p-1 pr-6 leading-relaxed text-center">
                  {Intl.NumberFormat('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(card.availableLimit / 100)}
                </td>
                <td className="p-1 pr-6 leading-relaxed text-center items-center">
                  {card.dueDate}
                </td>
                <td className="p-1 pr-6 leading-relaxed text-center">
                  {Intl.NumberFormat('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(card.invoice / 100)}
                </td>
                <td
                  className={`p-1 pr-6 leading-relaxed text-center font-semibold uppercase ${
                    card.statusInvoice === 'open' ||
                    card.statusInvoice === 'paid'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {card.statusInvoice === 'open'
                    ? 'Aberta'
                    : card.statusInvoice === 'paid'
                    ? 'Paga'
                    : 'Fechada'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}
