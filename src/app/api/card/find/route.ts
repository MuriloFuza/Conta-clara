import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  try {
    let list = await db.card.findMany({
      where: {
        userId: userId?.toString(),
      },
    })

    if (list.length < 1) {
      list = []
    }

    return NextResponse.json(
      {
        data: {
          status: 'success',
          object: list,
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
