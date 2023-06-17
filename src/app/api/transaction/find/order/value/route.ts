import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

type SortValue = 'asc' | 'desc'

export async function GET(request: NextRequest) {
  try {
    const sort = request.nextUrl.searchParams.get('sort') as SortValue

    let listAllTransactions
    if (sort) {
      listAllTransactions = await db.transaction.findMany({
        orderBy: {
          value: sort,
        },
      })
    }

    return NextResponse.json(
      {
        data: {
          status: 'success',
          listAllTransactions,
        },
      },
      { status: 200 },
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      {
        data: { status: 'failed', error: err },
      },
      { status: 400 },
    )
  }
}
