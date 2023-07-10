import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  const cardId = request.nextUrl.searchParams.get('cardId')

  try {
    const card = await db.card.findFirst({
      where: {
        userId: userId || '',
        id: cardId || '',
      },
    })

    if (cardId === card?.id && userId === card?.userId) {
      const list = await db.monthlyExpenses.findMany({
        where: {
          cardId,
        },
      })

      return NextResponse.json(
        {
          status: 'success',
          object: list,
        },
        {
          status: 200,
        },
      )
    } else {
      throw new Error('user or card not exists')
    }
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
