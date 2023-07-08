import { z } from 'zod'

export const CreateExpensesSchema = z.object({
  description: z.string().min(1, 'Insira a descrição'),
  installments: z.string(),
  value: z.string(),
  monthlyInterest: z.string(),
  initialMonth: z.string().nullish(),
  cardId: z.string(),
})

export type CreateExpensesSchemaType = z.infer<typeof CreateExpensesSchema>
