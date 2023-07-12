import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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
        value: Number(value.replace(/[R$,]/g, '')),
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
