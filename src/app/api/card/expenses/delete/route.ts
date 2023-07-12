import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function DELETE(request: NextRequest) {
  const expenseId = request.nextUrl.searchParams.get('expenseId')

  try {
    await db.monthlyExpenses.delete({
      where: {
        id: expenseId || '',
      },
    })

    return NextResponse.json(
      {
        status: 'deleted',
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
