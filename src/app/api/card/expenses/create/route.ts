import { db } from '@/libs/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: NextResponse) {
  const {
    cardId,
    description,
    value,
    initialMonth,
    monthlyInterest,
    installments,
  } = await request.json()

  try {
    await db.monthlyExpenses.create({
      data: {
        Card: {
          connect: {
            id: cardId,
          },
        },
        description,
        value: Number(value),
        initialMonth,
        monthlyInterest: Number(monthlyInterest),
        installments: Number(installments),
      },
    })

    return NextResponse.json(
      {
        status: 'success',
      },
      {
        status: 201,
      },
    )
  } catch (err) {
    return NextResponse.json(
      {
        status: 'failed',
        error: err,
      },
      {
        status: 400,
      },
    )
  }
}
