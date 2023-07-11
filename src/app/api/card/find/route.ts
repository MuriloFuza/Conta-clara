import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  try {
    const list = await db.card.findMany({
      where: {
        userId: userId?.toString(),
      },
    })

    let listReturn: any[] = []

    if (list.length < 1) {
      listReturn = []
    } else {
      await Promise.all(
        list.map(async (card) => {
          const monthlyExpenses = await db.monthlyExpenses.findMany({
            where: {
              cardId: card.id,
            },
          })

          let finalValue = 0
          monthlyExpenses.forEach((expense) => {
            if (expense.payment !== true) {
              finalValue += expense.value
            }
          })

          const day = new Date()
          console.log(finalValue)

          listReturn.push({
            id: card.id,
            name: card.name,
            limit: card.limit,
            dueDate: card.dueDate,
            statusInvoice:
              Number(card.dueDate) <= day.getDate()
                ? 'closed'
                : card.statusInvoice,
            availableLimit: card.limit - finalValue,
            invoice: finalValue,
            userId: card.userId,
          })
        }),
      )
    }

    return NextResponse.json(
      {
        data: {
          status: 'success',
          object: listReturn,
        },
      },
      {
        status: 200,
      },
    )
  } catch (err) {
    return NextResponse.json(
      {
        data: { status: 'failed', error: err },
      },
      { status: 400 },
    )
  }
}
