import {
  CreateExpensesSchema,
  CreateExpensesSchemaType,
} from '@/schemas/createExpensesInCard.zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '../input'
import { RangeDatePicker } from '../date-picker'
import dayjs from 'dayjs'

export default function ExpensesForm() {
  // handleSubmit,
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateExpensesSchemaType>({
    resolver: zodResolver(CreateExpensesSchema),
  })

  return (
    <div className="flex flex-row gap-x-4 ">
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
          if (value) {
            setValue(
              'initialMonth',
              dayjs(value.startDate)
                .set('hours', 0)
                .set('minutes', 0)
                .set('seconds', 0)
                .toISOString(),
            )
            setValue(
              'initialMonth',
              dayjs(value.endDate)
                .set('hours', 23)
                .set('minutes', 59)
                .set('seconds', 59)
                .subtract(4, 'hours')
                .toISOString(),
            )
          }
        }}
      />
    </div>
  )
}
