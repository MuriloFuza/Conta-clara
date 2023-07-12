'use client'
import { api } from '@/libs/api'
import { Plus } from 'lucide-react'
import { FormEvent, useState } from 'react'

interface NewTransactionFormProps {
  fetchTransactions: () => void
  userId: string
}

export function NewTransactionForm({
  fetchTransactions,
  userId,
}: NewTransactionFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const form = event.currentTarget
      const formData = new FormData(form)

      const descriptionInput = form.elements.namedItem(
        'description',
      ) as HTMLInputElement
      const typeSelect = form.elements.namedItem('type') as HTMLSelectElement
      const dateInput = form.elements.namedItem('date') as HTMLInputElement

      const description = formData.get('description')
      const type = formData.get('type')
      const value = formData.get('value')
      const date = formData.get('date')

      if (!description || !type || !value || !date) {
        // DESAFIO: Exibir alerta caso alguma das propriedades não existirem
        // pode ser feito com a API Alert do browser
        // eslint-disable-next-line no-useless-return
        return
      }

      const newValue = (value as string)
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace('R', '')

      await api
        .post('/transaction/create', {
          description,
          type,
          value: Number(newValue),
          userId,
          transaction_date: new Date(date as string),
        })
        .then(() => {
          fetchTransactions()

          descriptionInput.value = ''
          typeSelect.value = ''
          dateInput.value = ''
          setFormattedValue('')
        })

      // DESAFIO: Limpar os campos após a inserção
    } catch {
      throw new Error()
    }
  }

  const [formattedValue, setFormattedValue] = useState('')

  const handleChangeMoney = (event: { target: { value: any } }) => {
    const { value } = event.target
    const cleanedValue = value.replace(/\D/g, '') // Remove caracteres não numéricos
    const formatted = formatCurrency(cleanedValue)
    setFormattedValue(formatted)
  }

  const formatCurrency = (value: any) => {
    const options = {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
    const amount = Number(value) / 100
    return amount.toLocaleString('pt-BR', options)
  }

  return (
    <form
      className="flex gap-x-2 gap-y-2 md:gap-y-0 px-2 flex-col md:flex-row"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1 flex-1">
        <label>Descrição</label>
        <input
          className="h-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-600 rounded-lg p-2 bg-neutral-950 outline-none"
          placeholder="Ex.: Caldo de Cana"
          id="description"
          name="description"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label>Tipo</label>
        <select
          className="h-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-600 rounded-lg p-2 pr-8 border-0 bg-neutral-950 outline-none"
          id="type"
          name="type"
        >
          <option value="credit">Crédito</option>
          <option value="debit">Débito</option>
        </select>
      </div>
      <div className="flex flex-col gap-1 w-32">
        <label>Valor</label>
        <input
          type="text"
          value={formattedValue}
          onChange={handleChangeMoney}
          placeholder="R$ 0,00"
          className="h-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-600 rounded-lg p-2 bg-neutral-950 outline-none"
          id="value"
          name="value"
        />
      </div>
      <div className="flex flex-col gap-1 w-56">
        <label>Data</label>
        <input
          className="h-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-600 rounded-lg border-0 p-2 bg-neutral-950 outline-none"
          type="datetime-local"
          id="date"
          name="date"
        />
      </div>
      <button
        className="h-10 flex gap-x-1 mt-auto p-2 rounded-lg bg-blue-600 hover:bg-blue-700"
        type="submit"
      >
        <Plus size={24} />
        Adicionar
      </button>
    </form>
  )
}
