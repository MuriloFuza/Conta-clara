import { z } from 'zod'

export const CreateExpensesSchema = z.object({
  description: z.string().min(1, 'Insira a descrição'),
  installments: z.string().min(1, 'Insira as parcelas'),
  value: z.string().min(1, 'Insira o valor'),
  monthlyInterest: z.string().min(1, 'Insira o juros'),
  initialMonth: z.string().min(1, 'Insira o mês'),
  cardId: z.string().min(1, 'Insira o cartão'),
})

export type CreateExpensesSchemaType = z.infer<typeof CreateExpensesSchema>
