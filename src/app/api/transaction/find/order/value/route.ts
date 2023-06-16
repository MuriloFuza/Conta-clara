import { prisma } from '@/app/api/_base'
import { NextRequest, NextResponse } from 'next/server'

type SortValue = 'asc' | 'desc'

export async function GET(request: NextRequest) {
  try {
    const sort = request.nextUrl.searchParams.get('sort') as SortValue

    let listAllTransactions
    if (sort) {
      listAllTransactions = await prisma.transaction.findMany({
        orderBy: {
          value: sort,
        },
      })
    }

    return NextResponse.json({
      data: {
        status: 'success',
        listAllTransactions,
      },
    })
  } catch (err) {
    console.log(err)
    return NextResponse.json({
      data: { status: 'failed', error: err },
    })
  }
}
