import {
  CreateExpensesSchema,
  CreateExpensesSchemaType,
} from '@/schemas/createExpensesInCard.zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '../input'
import { RangeDatePicker } from '../date-picker'
import dayjs from 'dayjs'
import { Plus } from 'lucide-react'
import { api } from '@/libs/api'

interface ExpensesFormProps {
  fetchExpenses: (userId: string, card: string) => void
  userId: string
  card: string
}

export default function ExpensesForm({
  fetchExpenses,
  userId,
  card,
}: ExpensesFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm<CreateExpensesSchemaType>({
    resolver: zodResolver(CreateExpensesSchema),
    defaultValues: {
      cardId: card,
    },
  })
  const handleCreateExpense: SubmitHandler<CreateExpensesSchemaType> = async (
    data,
  ) => {
    await api.post('/card/expenses/create', data)
    fetchExpenses(userId, card)
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateExpense)}
      className="flex flex-row gap-x-4 "
    >
      <Input
        label="Descrição"
        error={errors.description}
        placeholder="Ex: Compra mensal IG"
        {...register('description')}
      />
      <Input
        label="N. Parcelas"
        error={errors.installments}
        placeholder="Ex: 4"
        type="number"
        {...register('installments')}
      />
      <Input
        label="Valor"
        error={errors.value}
        placeholder="R$ 0,00"
        {...register('value')}
      />
      <Input
        label="% Juros"
        error={errors.monthlyInterest}
        type="number"
        placeholder="Ex: 12"
        {...register('monthlyInterest')}
      />

      <RangeDatePicker
        name="DatePicker"
        label="Mês inicial"
        value={{
          startDate: watch(`initialMonth`) ?? new Date(),
          endDate: watch(`initialMonth`) ?? new Date(),
        }}
        onChange={(value) => {
          setValue(
            'initialMonth',
            dayjs(value?.startDate)
              .set('hours', 0)
              .set('minutes', 0)
              .set('seconds', 0)
              .toISOString(),
          )
        }}
      />
      <button
        type="submit"
        className="h-10 flex gap-x-1 mt-auto p-2 rounded-lg bg-blue-600 hover:bg-blue-700"
      >
        <Plus size={24} />
        Adicionar
      </button>
    </form>
  )
}
