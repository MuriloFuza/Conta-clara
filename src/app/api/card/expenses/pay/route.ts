import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  const { expenseId } = await request.json()

  try {
    await db.monthlyExpenses.update({
      where: {
        id: expenseId,
      },
      data: {
        payment: true,
      },
    })

    return NextResponse.json(
      {
        status: 'success',
      },
      {
        status: 200,
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
