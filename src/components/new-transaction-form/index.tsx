'use client'
import { api } from '@/libs/api'
import { Plus } from 'lucide-react'
import { FormEvent } from 'react'
import InputMask from 'react-input-mask'

interface NewTransactionFormProps {
  fetchTransactions: () => void
}

export function NewTransactionForm({
  fetchTransactions,
}: NewTransactionFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const formData = new FormData(event.currentTarget)

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

      await api.post('/create', {
        description,
        type,
        value: Number(newValue),
        transaction_date: new Date(date as string),
      })

      fetchTransactions()

      // DESAFIO: Limpar os campos após a inserção
    } catch {
      throw new Error()
    }
  }

  return (
    <form className="flex gap-x-2 px-2" onSubmit={handleSubmit}>
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
        <InputMask mask="R$ 99.999,99" alwaysShowMask>
          {/* @ts-ignore */}
          {(inputProps: any) => (
            <input
              {...inputProps}
              className="h-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-600 rounded-lg p-2 bg-neutral-950 outline-none"
              placeholder="Ex.: 1,43"
              id="value"
              name="value"
            />
          )}
        </InputMask>
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
